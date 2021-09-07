const { nanoid } = require("nanoid");
const InvariantError = require("../../exception/InvariantError");

class SongsService {
    constructor(){
        this._songs = [];
    }

    addSong({ title, year, performer, genre, duration }) {
        const id =  `song-${nanoid(16)}`;
        const createdAt = new Date().toISOString();
        const updatedAt = createdAt;

        const newSong = {
            title,
            year,
            performer,
            genre,
            duration,
            id,
            createdAt,
            updatedAt
        };

        this._songs.push(newSong);

        const isSuccess = this._songs.filter((song) => song.id === id).length > 0;
        if(!isSuccess) {
            throw new InvariantError('Song cannot be added.')
        }
        return id;
    }

    getSongs() {
        const mapping = ({
            id, 
            title,
            performer
        }) => ({
            id,
            title,
            performer
        })
        const result = this._songs;
        return result.map(mapping)
    }
}

module.exports = SongsService;