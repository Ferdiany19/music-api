const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exception/InvariantError');

class CollaborationService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
  }

  async postCollaborationService(playlistId, userId) {
    const id = `collab-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO collaborations VALUES($1,$2,$3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan koalborasi');
    }

    return result.rows[0].id;
  }

  async deleteCollaborationService(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Verifikasi kolaborasi gagal');
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
        await this._collaborationService.verifyCollaborationService(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = CollaborationService;
