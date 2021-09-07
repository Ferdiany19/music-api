const mapDB = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

const mapDBDetail = ({ id, title, year, performer, genre, duration, inserted_at, updated_at }) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insertedAt: inserted_at,
  updatedAt: updated_at,
});

const mapDbPlaylist = ({ id, name, username }) => ({
  id,
  name,
  username,
});

module.exports = { mapDB, mapDBDetail, mapDbPlaylist };
