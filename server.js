const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

// Serve the frontend (index.html, CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Serve images from the images directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// Function to get the total number of images
const getImageCount = () => {
    try {
        const imageDir = path.join(__dirname, 'images');
        const files = fs.readdirSync(imageDir).filter(file => 
            /\.(jpg|jpeg|png)$/i.test(file)
        );
        return files.length;
    } catch (error) {
        console.error('Error reading image directory:', error);
        return 0;
    }
};

// API Endpoint: Get a random image URL
app.get('/api/random-image', (req, res) => {
    try {
        const imageCount = getImageCount();
        if (imageCount === 0) {
            return res.status(404).json({ error: 'No images found' });
        }

        const randomNum = Math.floor(Math.random() * imageCount) + 1;
        const imageUrl = `http://localhost:3000/images/${randomNum}.jpg`;

        res.json({ imageUrl, imageNumber: randomNum, totalImages: imageCount });
    } catch (error) {
        console.error('Error serving random image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API Endpoint: Get multiple random images
app.get('/api/random-images/:count', (req, res) => {
    try {
        const requestedCount = parseInt(req.params.count) || 1;
        const maxImages = Math.min(requestedCount, 10);
        const imageCount = getImageCount();
        
        if (imageCount === 0) {
            return res.status(404).json({ error: 'No images found' });
        }

        const randomImages = [];
        const usedNumbers = new Set();

        while (randomImages.length < maxImages && usedNumbers.size < imageCount) {
            const randomNum = Math.floor(Math.random() * imageCount) + 1;
            
            if (!usedNumbers.has(randomNum)) {
                usedNumbers.add(randomNum);
                randomImages.push({
                    imageUrl: `/images/${randomNum}.jpg`,
                    imageNumber: randomNum
                });
            }
        }

        res.json({ images: randomImages, totalImages: imageCount });
    } catch (error) {
        console.error('Error serving random images:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', imagesAvailable: getImageCount() });
});

// Serve index.html when visiting the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
