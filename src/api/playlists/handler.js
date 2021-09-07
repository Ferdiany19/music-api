const ClientError = require('./../../exception/ClientError');

class PlaylistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postPlaylistHandler(request, h) {
    try {
      await this.validator.validatePostPlaylistPayloadSchema(request.payload);

      const { name } = request.payload;
      const { userId: owner } = request.auth.credentials;
      const playlistId = await this._service.postPlaylistsService({ name, owner });

      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil ditambahkan',
        data: {
          playlistId,
        },
      });
      return response.code(201);
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Terjadi server error',
      });
      response.code(500);
      return console.error(error);
    }
  }

  async getPlaylistHandler(request, h) {
    try {
      const { userId } = request.auth.credentials;
      const playlist = await this._service.getPlaylistService(userId);

      return {
        status: 'success',
        data: {
          playlist,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Terjadi server error',
      });
      response.code(500);
      return console.error(error);
    }
  }

  async deletePlaylistHandler(request, h) {
    try {
      const { playlistId } = request.params;
      const { userId } = request.auth.credentials;

      await this._service.playlistVerifyService(playlistId, userId);
      await this._service.playlistsDeleteService(playlistId);

      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Terjadi server error',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = PlaylistHandler;
