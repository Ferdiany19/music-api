class PlaylistSongHandler {
  constructor(songsService, playlistService, playlistsSongService, validator) {
    this._songService = songsService;
    this._playlistService = playlistService;
    this._playlistsSongService = playlistsSongService;
    this._validator = validator;

    this.playlistsPostSongsHandler = this.playlistsPostSongsHandler.bind(this);
    this.playlistsGetSongsHandler = this.playlistsGetSongsHandler.bind(this);
    this.playlistsDeleteSongsHandler = this.playlistsDeleteSongsHandler.bind(this);
  }

  async playlistsPostSongsHandler(r, h) {
    try {
      this._validator.validatePostPlaylistSongsPayload(r.payload);
      const { songId } = r.payload;
      const { playlistId } = r.params;
      const { userId } = r.auth.credentials;

      await this._playlistService.verifyPlaylistAccess(playlistId, userId);
      await this._songService.verifySongService(songId);
      await this._playlistSongService.postPlaylistsSongService({ playlistId, songId });

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      });
      return response.code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        return response.code(error.statusCode);
      }

      const response = h.response({
        status: 'error',
        message: 'Terjadi server error',
      });
      console.warn(error);
      return response.code(500);
    }
  }

  async playlistsGetSongsHandler(r, h) {
    try {
      const { userId } = r.auth.credentials;
      const { playlistId } = r.params;

      await this._playlistService.verifyPlaylistAccess(playlistId, userId);
      const songs = await this._playlistSongService.getPlaylistsSongService(playlistId);

      return {
        status: 'success',
        data: {
          songs,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        return response.code(error.statusCode);
      }

      const response = h.response({
        status: 'error',
        message: 'Terjadi server error',
      });
      console.warn(error);
      return response.code(500);
    }
  }

  async playlistsDeleteSongsHandler(r, h) {
    try {
      this._validator.validateDeletePlaylistSongsPayload(r.payload);
      const { songId } = r.payload;
      const { userId } = r.auth.credentials;
      const { playlistId } = r.params;

      await this._playlistService.verifyPlaylistAccess(playlistId, userId);
      await this._songService.verifySongService(songId);
      await this._playlistSongService.deletePlaylistsSongService(playlistId, songId);

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        return response.code(error.statusCode);
      }

      const response = h.response({
        status: 'error',
        message: 'Terjadi server error',
      });
      console.warn(error);
      return response.code(500);
    }
  }
}

module.exports = PlaylistSongHandler;
