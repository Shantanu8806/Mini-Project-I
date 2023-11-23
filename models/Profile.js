const mongoose = require('mongoose');


const userProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  parkingSpaceDescription: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  upiBarcode:{
    type: String,
    required: true,
  },
});


const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;
