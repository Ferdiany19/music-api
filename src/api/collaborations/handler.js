const ClientError = require('./../../exception/ClientError');

class CollaborationHandler {
  constructor(collaborationService, playlistService, validator) {
    this._collaborationservice = collaborationService;
    this._playlistService = playlistService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload);
      const { playlistId, userId } = request.payload;
      const { userId: credentialId } = request.auth.credentials;

      await this._playlistService.playlistVerifyService(playlistId, credentialId);
      const collabId = await this._collaborationService.postCollaborationService(
        playlistId,
        userId
      );

      const response = h.response({
        status: 'success',
        message: 'collaboration berhassil ditambahkan',
        data: {
          collabId,
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

      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteCollaborationHandler(request, h) {
    this._validator.validateCollaborationsPayload(r.payload);
    const { playlistId, userId } = r.payload;
    const { userId: credentialId } = r.auth.credentials;

    await this._playlistService.playlistVerifyService(playlistId, credentialId);
    await this._collaborationService.deleteCollaborationService(playlistId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
  catch(error) {
    if (error instanceof ClientError) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(error.statusCode);
      return response;
    }

    // Server ERROR!
    const response = h.response({
      status: 'error',
      message: 'Maaf, terjadi kegagalan pada server kami.',
    });
    response.code(500);
    console.error(error);
    return response;
  }
}

module.exports = CollaborationHandler;
