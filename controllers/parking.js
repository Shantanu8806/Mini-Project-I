const cloudinary = require('cloudinary').v2;
const ParkingSpace = require('../models/Space');
const ParkingBooking = require('../models/Booking');
const uploadImageToCloudinary = require('../config/cloudinary');
// Controller function for adding a parking space
const addParkingSpace = async (req, res) => {
  try {
    // Extract parking space data from the request body
    const {
      ownerId,
      parkingNumber,
      parkingAreaDescription,
      hourlyCost,
      dailyCost,
      weeklyCost,
      monthlyCost,
      latitude,
      longitude,
      address,
    } = req.body;

    // Upload the parkingSpaceImage to Cloudinary
    const parkingSpaceImage = req.files.parkingSpaceImage; // Assuming req.file contains the image file
    const result  =await uploadImageToCloudinary(parkingSpaceImage[0].tempFilePath);
    console.log(result);
    // Create a new parking space with the Cloudinary image URL
    const newParkingSpace = new ParkingSpace({
      owner: ownerId,
      parkingNumber,
      parkingAreaDescription,
      hourlyCost,
      dailyCost,
      weeklyCost,
      monthlyCost,
      latitude,
      longitude,
      address,
      parkingSpaceImage: result, // Use the secure URL provided by Cloudinary
    });

    // Save the new parking space to the database
    await newParkingSpace.save();
    console.log(newParkingSpace);
    res.status(201).json({ message: 'Parking space added successfully', parkingSpace: newParkingSpace });
  } catch (error) {
    console.log(req.files.parkingSpaceImage);
    console.log(req.files.parkingSpaceImage[0].tempFilePath);
    console.error(error);
    // console.log(req.body);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const updateParkingSpace = async (req, res) => {
  try {
    const { parkingSpaceId } = req.params;

    // Check if the parking space exists
    const existingParkingSpace = await ParkingSpace.findById(parkingSpaceId);
    if (!existingParkingSpace) {
      return res.status(404).json({ error: 'Parking space not found.' });
    }

    // Extract updated parking space data from the request body
    const {
      ownerId,
      parkingNumber,
      parkingAreaDescription,
      cost,
      latitude,
      longitude,
      address,
      parkingSpaceImage,
    } = req.body;

    // Update the parking space
    existingParkingSpace.owner = ownerId || existingParkingSpace.owner;
    existingParkingSpace.parkingNumber = parkingNumber || existingParkingSpace.parkingNumber;
    existingParkingSpace.parkingAreaDescription = parkingAreaDescription || existingParkingSpace.parkingAreaDescription;
    existingParkingSpace.cost = cost || existingParkingSpace.cost;
    existingParkingSpace.latitude = latitude || existingParkingSpace.latitude;
    existingParkingSpace.longitude = longitude || existingParkingSpace.longitude;
    existingParkingSpace.address = address || existingParkingSpace.address;
    existingParkingSpace.parkingSpaceImage = parkingSpaceImage || existingParkingSpace.parkingSpaceImage;

    // Save the updated parking space to the database
    await existingParkingSpace.save();

    res.status(200).json({ message: 'Parking space updated successfully', parkingSpace: existingParkingSpace });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteParkingSpace = async (req, res) => {
  try {
    const { parkingSpaceId } = req.params;

    // Check if the parking space exists
    const existingParkingSpace = await ParkingSpace.findById(parkingSpaceId);
    if (!existingParkingSpace) {
      return res.status(404).json({ error: 'Parking space not found.' });
    }

    // Delete the parking space
    await existingParkingSpace.remove();

    res.status(200).json({ message: 'Parking space deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllParkingSpacesNotOccupied = async (req, res) => {
  try {
    console.log('Fetching unoccupied parking spaces...');
    const unoccupiedParkingSpaces = await ParkingSpace.find({ isOccupied: false });
    console.log('Fetched unoccupied parking spaces:', unoccupiedParkingSpaces);

    res.status(200).json({ parkingSpaces: unoccupiedParkingSpaces });
  } catch (error) {
    console.error('Error fetching unoccupied parking spaces:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getParkingSpaceDetails = async (req, res) => {
  try {
    // Extract parking space ID from the request parameters
    const parkingSpaceId  = req.params.spaceId;

    // Use Mongoose to find the parking space with the specified ID
    const parkingSpace = await ParkingSpace.findById(parkingSpaceId)
      .populate({
        path: 'owner',
      })
      .populate({
        path: 'occupant',
      });

    if (!parkingSpace) {
      return res.status(404).json({ error: 'Parking space not found' });
    }

    // Extract relevant details
    const {
      parkingNumber,
      parkingAreaDescription,
      hourlyCost,
      dailyCost,
      weeklyCost,
      monthlyCost,
      isOccupied,
      occupant,
      owner,
      latitude,
      longitude,
      address,
      parkingSpaceImage,
    } = parkingSpace;

    // Extract owner details
    const ownerDetails = {
      ownerId: owner._id,
      ownerName: owner.fullName,
      ownerMobileNumber: owner.mobileNumber,
      ownerEmail: owner.email,
      ownerAddress: owner.address,
    };

    // Extract occupant details if parking space is occupied
    let occupantDetails = null;
    if (isOccupied && occupant) {
      occupantDetails = {
        occupantId: occupant._id,
        occupantName: occupant.fullName,
        occupantMobileNumber: occupant.mobileNumber,
        occupantEmail: occupant.email,
      };
    }

    res.status(200).json({
      parkingSpaceDetails: {
        parkingNumber,
        parkingAreaDescription,
        hourlyCost,
        dailyCost,
        weeklyCost,
        monthlyCost,
        isOccupied,
        occupant: occupantDetails,
        owner: ownerDetails,
        latitude,
        longitude,
        address,
        parkingSpaceImage,
      },
    });
    console.log(parkingSpace);
  } catch (error) {
    console.log(req.params.spaceId);
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getParkingSpacesByOwner = async (req, res) => {
  try {
    const ownerId = req.params.userId; // Assuming ownerId is passed as a route parameter

    // Find all parking spaces belonging to the specified owner
    const parkingSpaces = await ParkingSpace.find({ owner: ownerId });

    if (!parkingSpaces) {
      return res.status(404).json({ message: 'No parking spaces found for the specified owner' });
    }

    res.status(200).json({ parkingSpaces });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getLatestBookingForParkingSpace = async (req, res) => {
  try {
    // Extract parking space ID from the request parameters
    const spaceId  = req.params.spaceId;

    // Use Mongoose to find the latest booking for the specified parking space ID
    const latestBooking = await ParkingBooking
      .findOne({ parkingSpace: spaceId })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order to get the latest booking first
      .populate('tenant') // If you want to populate tenant details, add this line
      .exec();

    if (!latestBooking) {
      return res.status(404).json({ error: 'No bookings found for the specified parking space' });
    }

    res.status(200).json({ latestBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' ,message:'error'});
    console.log(req.params.spaceId);
  }
};


module.exports = {getLatestBookingForParkingSpace,getParkingSpaceDetails,getParkingSpacesByOwner, deleteParkingSpace, addParkingSpace, updateParkingSpace, getAllParkingSpacesNotOccupied, getParkingSpaceDetails };


