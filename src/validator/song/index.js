const songSchemaPayload = require('./schema');
const InvariantError = require('../../exception/InvariantError');

const SongValidator = {
  validateSongPayload: (payload) => {
    const validation = songSchemaPayload.validate(payload);
    if (validation.error) {
      throw new InvariantError(validation.error.message);
    }
  },
};

module.exports = SongValidator;
