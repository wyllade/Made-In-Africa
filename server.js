require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows public access
app.use(express.json()); // Parses JSON requests

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Sample Artwork Schema (MongoDB)
const Artwork = mongoose.model('Artwork', {
    title: String,
    artist: String,
    image: String,
    price: Number,
});

// Public API - Get all artworks
app.get('/api/artworks', async (req, res) => {
    try {
        const artworks = await Artwork.find();
        res.json(artworks);
    } catch (err) {
        res.status(500).json({ message: "Error fetching artworks" });
    }
});

// Start server
app.listen(PORT, () => console.log(`🚀 API running on http://localhost:${PORT}`));
