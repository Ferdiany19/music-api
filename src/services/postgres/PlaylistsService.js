const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('./../../exception/NotFoundError');
const InvariantError = require('./../../exception/InvariantError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
    // this._collaborationService = collaborationService;
  }

  async postPlaylistsService({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1,$2,$3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan.');
    }

    return result.rows[0].id;
  }

  async getPlaylistService(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
          FROM playlists
          FULL JOIN users ON playlists.owner = users.id
          FULL JOIN collaborations ON playlists.id = collaborations.playlist_id
          WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
      values: [owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Maaf, Playlist tidak ditemukan.');
    }
    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('Anda tidak dapat mengakses playlist ini');
    }
  }

  async deletePlaylistService(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id, owner',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.playlistVerifyService(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborationsService(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
