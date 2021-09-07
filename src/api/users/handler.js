const ClientError = require('./../../exception/ClientError');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(request, h) {
    try {
      this._validator.validateUserPayload(request.payload);
      const { username, password, fullname } = request.payload;

      const userId = await this._service.addUser({ username, password, fullname });

      const response = h.response({
        status: 'success',
        message: 'user berhasil ditambahkan!',
        data: {
          userId,
        },
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

      // Server Error!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });

      console.warn(error);

      return response.code(500);
    }
  }
}

module.exports = UsersHandler;
