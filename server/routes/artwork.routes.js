const express = require('express');
const ArtworkRouter = express.Router();
const {
    likeArtwork,
    unlikeArtwork,
} = require('../controllers/likes.controllers');
const { getAllArtworks, addArtwork, getArtworkById } = require('../controllers/artwork.controllers');

ArtworkRouter.get('/all', getAllArtworks);
ArtworkRouter.post('/add/:id', addArtwork);
ArtworkRouter.put('/like/:id', likeArtwork);
ArtworkRouter.put('/unlike/:id', unlikeArtwork);
ArtworkRouter.get('/one/:id', getArtworkById)

module.exports = ArtworkRouter;
