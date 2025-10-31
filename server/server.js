const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
const ArtworkRouter = require('./routes/artwork.routes');

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// routes
app.use('/api/artworks', ArtworkRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});