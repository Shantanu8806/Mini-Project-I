const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const Tenant = require('../models/Tenant');
const Owner = require('../models/Owner');
require('dotenv').config();

// Controller function for tenant login
const loginTenant = async (req, res) => {
  try {
    // Extract login data from the request body
    const { email, password } = req.body;

    // Check if the tenant exists with the provided email
    const tenant = await Tenant.findOne({ email });
    if (!tenant) {
      console.log(tenant)
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, tenant.password);
    if (!isPasswordValid) {
      console.log(tenant.password);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token for the authenticated tenant
    const token = jwt.sign({ userId: tenant._id }, process.env.JWT_SECRET, { expiresIn: '3h' });

    // Set the token as a cookie
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour expiration

    res.status(200).json({ message: 'Tenant logged in successfully',token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const loginOwner = async (req, res) => {
  try {
    // Extract login data from the request body
    const { email, password } = req.body;

    // Check if the owner exists with the provided email
    const owner = await Owner.findOne({ email });
    if (!owner) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, owner.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token for the authenticated owner
    const token = jwt.sign({ userId: owner._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Set the token as a cookie
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour expiration

    res.status(200).json({ message: 'Owner logged in successfully',token});
    console.log(token);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { loginTenant, loginOwner };
