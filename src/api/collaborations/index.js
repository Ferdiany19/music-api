const routes = require('./routes');
const CollaborationHandler = require('./handler');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, { collaborationsService, playlistsService, validator }) => {
    const collaborationsHandler = new CollaborationHandler(
      collaborationsService,
      playlistsService,
      validator
    );

    server.route(routes(collaborationsHandler));
  },
};
