const express = require('express');
const router = express.Router();
const Config = require('../models/config');

// Route to fetch the API key
router.get('/api/v2/config', async (req, res) => {
    try {
        const config = await Config.findOne();
        if (!config) {
            return res.status(404).json({ error: 'API key not found' });
        }
        res.json({ apiKey: config.apiKey });
    } catch (error) {
        console.error('Error fetching API key:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
