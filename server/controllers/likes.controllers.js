const Artwork = require('../models/artwork.models');

// [PUT] /api/artworks/like/:id
const likeArtwork = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedArtwork = await Artwork.findOneAndUpdate(
            { id: id },
            { $inc: { likes: 1 } },
            { new: true }
        );

        if (updatedArtwork) {
            console.log(`PUT /api/artworks/like/${id} - Liked. New count: ${updatedArtwork.likes}`);
            res.status(200).json(updatedArtwork);
        } else {
            console.log(`PUT /api/artworks/like/${id} - Artwork not found.`);
            res.status(404).json({ message: 'Artwork not found' });
        }
    } catch (error) {
        console.error(`Error liking artwork ${id}:`, error);
        res.status(500).json({ message: 'Failed to update likes' });
    }
};

// [PUT] /api/artworks/unlike/:id
const unlikeArtwork = async (req, res) => {
    const { id } = req.params;
    try {
        const artworkToUpdate = await Artwork.findOne({ id: id });

        if (!artworkToUpdate) {
            console.log(`PUT /api/artworks/unlike/${id} - Artwork not found.`);
            return res.status(404).json({ message: 'Artwork not found' });
        }

        if (artworkToUpdate.likes === 0) {
            console.log(`PUT /api/artworks/unlike/${id} - Cannot unlike. Count is already 0.`);
            return res.status(200).json(artworkToUpdate);
        }

        artworkToUpdate.likes -= 1;
        const updatedArtwork = await artworkToUpdate.save();

        console.log(`PUT /api/artworks/unlike/${id} - Unliked. New count: ${updatedArtwork.likes}`);
        res.status(200).json(updatedArtwork);

    } catch (error) {
        console.error(`Error unliking artwork ${id}:`, error);
        res.status(500).json({ message: 'Failed to update likes' });
    }
};

module.exports = {
    likeArtwork,
    unlikeArtwork,
};
