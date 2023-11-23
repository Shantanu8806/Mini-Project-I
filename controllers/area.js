const ParkingArea = require('../models/parkingArea');

// Controller function for admin to add a parking area
const addParkingArea = async (req, res) => {
  try {
    // Extract data from the request body
    const { name, location, capacity } = req.body;

    // Check if the parking area with the same name already exists
    const existingParkingArea = await ParkingArea.findOne({ name });

    if (existingParkingArea) {
      return res.status(409).json({ error: 'Parking area with the same name already exists' });
    }

    // Create a new parking area
    const newParkingArea = new ParkingArea({
      name,
      location,
      capacity,
      parkingSpaces: [], // Initialize with an empty array of parking spaces
    });

    // Save the parking area to the database
    await newParkingArea.save();

    res.status(201).json({ message: 'Parking area added successfully', parkingArea: newParkingArea });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { addParkingArea };
