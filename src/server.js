require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// songs
const songs = require('./api/songs/index');
const SongsService = require('./services/postgres/SongsService');
const SongValidator = require('./validator/song/index');

// users
const users = require('./api/users/index');
const UsersService = require('./services/postgres/UsersService');
const UserValidator = require('./validator/user/index');

// authentication
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const AuthenticationsValidator = require('./validator/authentications');

// playlists
const playlists = require('./api/playlists/index');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistValidator = require('./validator/playlists/index');

// collaboration
const collaboration = require('./api/collaborations/index');
const CollaborationService = require('./services/postgres/CollaborationService');
const CollaborationValidator = require('./validator/collaborations');

// playlistSongs
const playlistSongs = require('./api/playlistSongs');
const PlaylistsSongService = require('./services/postgres/PlaylistsSongService');
const PlaylistSongsValidator = require('./validator/playlistSongs');

// token
const TokenManager = require('./tokenize/TokenManager');

const init = async () => {
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationService = new CollaborationService();
  const playlistsService = new PlaylistsService(collaborationService);
  const playlistsSongService = new PlaylistsSongService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // external plugin
  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        userId: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongValidator,
      },
      plugin: users,
      options: {
        service: usersService,
        validator: UserValidator,
      },
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistValidator,
      },
      plugin: collaboration,
      options: {
        collaborationService,
        playlistsService,
        validator: CollaborationValidator,
      },
      plugin: playlistSongs,
      options: {
        songsService,
        playlistsService,
        playlistsSongService,
        validator: PlaylistSongsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
