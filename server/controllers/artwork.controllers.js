const Artwork = require('../models/artwork.models');

// [GET] /api/artworks/all
const getAllArtworks = async (req, res) => {
    try {
        const artworks = await Artwork.find({});
        console.log('GET /api/artworks/all - Responding with all artworks');
        res.status(200).json(artworks);
    } catch (error) {
        console.error('Error fetching artworks:', error);
        res.status(500).json({ message: 'Failed to fetch artworks' });
    }
};

// [POST] /api/artworks/add/:id
const addArtwork = async (req, res) => {
    const { id } = req.params;
    try {
        const existingArtwork = await Artwork.findOne({ id: id });
        if (existingArtwork) {
            console.log(`POST /api/artworks/add/${id} - Artwork already exists.`);
            return res.status(409).json({ message: 'Artwork already exists' });
        }

        const newArtwork = await Artwork.create({ id: id, likes: 0 });
        console.log(`POST /api/artworks/add/${id} - Added new artwork:`, newArtwork);
        res.status(201).json(newArtwork);
    } catch (error) {
        console.error(`Error adding artwork ${id}:`, error);
        res.status(500).json({ message: 'Failed to add new artwork' });
    }
};

const getArtworkById = async (req, res) => {
    try {
        const { id } = req.params;
        const artwork = await Artwork.findOne({ id: id });
        res.status(200).json(artwork);
    } catch (error) {
        console.error(`Error fetching artwork ${id}:`, error);
        throw new Error('Failed to fetch artwork');
    }
}


module.exports = {
    getAllArtworks,
    addArtwork,
    getArtworkById,
};  