const { DeletePlaylistSongsPayloadSchema, PostPlaylistSongsPayloadSchema } = require('./schema');
const InvariantError = require('./../../exception/InvariantError');

const PlaylistSongValidator = {
  validatePostPlaylistSongsPayload: (payload) => {
    const validationResult = PostPlaylistSongsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeletePlaylistSongsPayload: (payload) => {
    const validationResult = DeletePlaylistSongsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistSongValidator;
