const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFoundError');
const { mapDB, mapDBDetail } = require('../../utils');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, performer, genre, duration }) {
    const id = `song-${nanoid(16)}`;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const query = {
      text: 'INSERT INTO song VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      values: [id, title, year, performer, genre, duration, insertedAt, updatedAt],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Cannot add song.');
    }

    return result.rows[0].id;
    s;
  }

  async getSongs() {
    const result = await this._pool.query('SELECT * FROM song');
    return result.rows.map(mapDB);
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM song WHERE id = $1',
      values: [id],
    };
    const selectFromDB = await this._pool.query(query);

    if (!selectFromDB.rows.length) {
      throw new NotFoundError('Song not found.');
    }
    return selectFromDB.rows.map(mapDBDetail)[0];
  }

  async editSongById(id, { title, year, performer, genre, duration }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE song SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
      values: [title, year, performer, genre, duration, updatedAt, id],
    };

    const queryResult = await this._pool.query(query);
    if (!queryResult.rows.length) {
      throw new NotFoundError('Sorrry, song not found!');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM song WHERE id = $1 RETURNING id',
      values: [id],
    };

    const queryResult = await this._pool.query(query);

    if (!queryResult.rows.length) {
      throw new NotFoundError('Song cannot be deleted. ID not found.');
    }
  }
}

module.exports = SongsService;
