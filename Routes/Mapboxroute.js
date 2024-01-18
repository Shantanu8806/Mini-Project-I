
const express = require('express');
const router = express.Router();
const { getMapboxToken } = require('../controllers/Mapbox');
router.get('/mapbox-token', getMapboxToken);

module.exports = router;