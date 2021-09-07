const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('./../../exception/InvariantError');
const AuthenticationError = require('./../../exception/AuthenticationError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({ username, password, fullname }) {
    await this.verifyUsernameService(username);

    const id = `user-${nanoid(16)}`;
    const hashPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashPassword, fullname],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async verifyUsernameService(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);
    if (result.rows.length > 0) {
      throw new InvariantError('Username sudah digunakan.');
    }
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AuthenticationError('Maaf, kredensial yang anda berikan salah.');
    }

    const { id, password: hashPassword } = result.rows[0];
    const matched = await bcrypt.compare(password, hashPassword);
    if (!matched) {
      throw new AuthenticationError('Maaf, kredensial yang anda berikan salah.');
    }
    return id;
  }
}

module.exports = UsersService;
