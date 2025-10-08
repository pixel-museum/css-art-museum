const mongoose = require('mongoose');

const ArtworkSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    likes: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    }
});

const Artwork = mongoose.model('Artwork', ArtworkSchema);

module.exports = Artwork;
