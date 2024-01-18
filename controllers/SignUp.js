const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2; // Make sure to install the 'cloudinary' package
const Owner = require('../models/Owner');
const Tenant = require('../models/Tenant');
const uploadImageToCloudinary = require('../config/cloudinary');
cloudinary.config({
  cloud_name: 'dnmlmaz3l',
  api_key: '164551416158321',
  api_secret: 'zeBaNAboNedbnADJNXAA_QrJ2eE',
});

const signUpOwner = async (req, res) => {
  try {
    const { fullName, dateOfBirth, gender, mobileNumber, email, address, password } = req.body;
    const profilePic = req.files.profilePic; // Assuming req.files is an object containing the uploaded file

    // Check if the owner already exists with the provided email
    const existingOwner = await Owner.findOne({ email });
    if (existingOwner) {
      return res.status(409).json({ error: 'Owner with this email already exists.' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload profile picture to Cloudinary
    const result = await uploadImageToCloudinary(profilePic.tempFilePath);
    console.log(result);
    // Create a new owner
    const newOwner = new Owner({
      fullName,
      dateOfBirth,
      gender,
      mobileNumber,
      email,
      address,
      profilePic: result,
      password: hashedPassword,
    });
    // Save the new owner to the database
    await newOwner.save();
    console.log(newOwner);
    console.log('Owner registered successfully');
    console.log(req.files.profilePic);
    res.status(201).json({ message: 'Owner registered successfully', owner: newOwner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = signUpOwner;


// Controller function for signing up a tenant
const signUpTenant = async (req, res) => {
  try {
    // Extract tenant data from the request body
    const {
      fullName,
      email,
      gender,
      address,
      vehicle,
      vehicleType,
      password,
      contactNumber, // New field for profile picture
    } = req.body;
    const profilePic = req.files.profilePic; // Assuming req.files is an object containing the uploaded file
    // Check if the tenant already exists with the provided email
    const existingTenant = await Tenant.findOne({ email });
    if (existingTenant) {
      return res.status(409).json({ error: 'Tenant with this email already exists.' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload profile picture to Cloudinary
    const profilePicUrl = await uploadImageToCloudinary(profilePic.tempFilePath);

    // Create a new tenant with profile picture
    const newTenant = new Tenant({
      fullName,
      email,
      gender,
      address,
      vehicle,
      vehicleType,
      password: hashedPassword,
      contactNumber,
      profilePic: profilePicUrl,
    });
    // Save the new tenant to the database
    await newTenant.save();

    res.status(201).json({ message: 'Tenant registered successfully', tenant: newTenant });
  } catch (error) {
    console.log(req.files.profilePic);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {signUpOwner,signUpTenant};