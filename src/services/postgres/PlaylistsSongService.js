const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exception/InvariantError');

class PlaylistsSongService {
  constructor() {
    this._pool = new Pool();
  }

  async postPlaylistsSongService({ playlistId, songId }) {
    const id = `playlistsongs-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1,$2,$3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Gagal menambahkan lagu ke playlist');
    }
  }

  async getPlaylistsSongService(playlistId) {
    const query = {
      text: `SELECT music.id, music.title, music.performer
        FROM playlistsongs
        INNER JOIN music ON playlistsongs.song_id = music.id
        WHERE playlistsongs.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deletePlaylistsSongService(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menghapus playlist');
    }
  }
}

module.exports = PlaylistsSongService;
