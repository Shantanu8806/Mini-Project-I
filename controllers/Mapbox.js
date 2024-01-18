require('dotenv').config();

const getMapboxToken = async (req, res) => {
    try {
      const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;
  
      if (!mapboxToken) {
        return res.status(500).json({ error: 'Mapbox access token not found.' });
      }
  
      return res.json({ mapboxToken });
    } catch (error) {
      console.error('Error getting Mapbox token:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  };

module.exports = { getMapboxToken };