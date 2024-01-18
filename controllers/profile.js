// controllers/userProfileController.js

const UserProfile = require('../models/Owner');

// Controller function to create a user profile
exports.createProfile = async (req, res) => {
  try {
    const { user, name, address, parkingSpaceDescription, email, upiBarcode } = req.body;

    // Check if the user profile already exists
    const existingProfile = await UserProfile.findOne({ user });
    if (existingProfile) {
      return res.status(400).json({ error: 'User profile already exists.' });
    }

    // Create a new user profile
    const userProfile = new UserProfile({
      user,
      name,
      address,
      parkingSpaceDescription,
      email,
      upiBarcode,
    });

    await userProfile.save();
    return res.status(201).json({ message: 'User profile created successfully.', userProfile });
  } catch (error) {
    console.error('Error creating user profile:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Controller function to update a user profile
exports.updateProfile = async (req, res) => {
  try {
    const { user } = req.params; // Assuming user is passed as a parameter in the URL
    const updateFields = req.body;

    // Check if the user profile exists
    const existingProfile = await UserProfile.findOne({ user });
    if (!existingProfile) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    // Update the user profile
    Object.assign(existingProfile, updateFields);
    await existingProfile.save();

    return res.status(200).json({ message: 'User profile updated successfully.', userProfile: existingProfile });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Controller function to delete a user profile
exports.deleteProfile = async (req, res) => {
  try {
    const { user } = req.params; // Assuming user is passed as a parameter in the URL

    // Check if the user profile exists
    const existingProfile = await UserProfile.findOne({ user });
    if (!existingProfile) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    // Delete the user profile
    await existingProfile.remove();

    return res.status(200).json({ message: 'User profile deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user profile:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


