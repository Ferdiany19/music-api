const { PostPlaylistPayloadSchema, PostPlaylistSongsPayloadSchema } = require('./schema');
const InvariantError = require('./../../exception/InvariantError');

const PlaylistValidator = {
  validatePostPlaylistPayloadSchema: (payload) => {
    const validationResult = PostPlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePostPlaylistSongsPayloadSchema: (payload) => {
    const validationResult = PostPlaylistSongsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistValidator;
