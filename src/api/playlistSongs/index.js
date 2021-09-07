const routes = require('./routes');
const PlaylistsSongHandler = require('./handler');

module.exports = {
  name: 'playlistsong',
  vrsione: '1.0.0',
  register: async (server, { songsService, playlistsService, playlistsSongService, validator }) => {
    const playlistsSongHandler = new PlaylistsSongHandler(
      songsService,
      playlistsService,
      playlistsSongService,
      validator
    );
    server.route(routes(playlistsSongHandler));
  },
};
