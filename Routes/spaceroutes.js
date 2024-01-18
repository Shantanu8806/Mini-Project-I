const express = require('express');
const router = express.Router();
const {authenticateTenant ,authenticateOwner}= require('../middlewares/auth')
const {getParkingSpacesByOwner, addParkingSpace, updateParkingSpace, deleteParkingSpace,getAllParkingSpacesNotOccupied ,getParkingSpaceDetails,getLatestBookingForParkingSpace} = require('../controllers/parking');

// Middleware for Cloudinary file uploads
const cloudinaryUpload = async (req, res, next) => {
  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      req.cloudinaryUrl = result.secure_url;
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error uploading file to Cloudinary' });
  }
};

// Routes for parking spaces
router.get('/latest/:parkingSpaceId',getLatestBookingForParkingSpace);
router.get('/spaceDetails/:spaceId',getParkingSpaceDetails);
router.get('/getparking-space-owner/:userId',getParkingSpacesByOwner);
router.post('/addparking-space',addParkingSpace);
router.put('/parking-space/:parkingSpaceId', cloudinaryUpload, updateParkingSpace);
router.delete('/parking-space/:parkingSpaceId', deleteParkingSpace);
router.get('/parking-spaceNotOccupied', getAllParkingSpacesNotOccupied)
router.get('/parking-spaceDetails', getParkingSpaceDetails);

module.exports = router;
