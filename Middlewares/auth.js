const jwt = require('jsonwebtoken');
const Owner = require('../models/Owner');
const Tenant = require('../models/Tenant');
require('dotenv').config();
const authenticateOwner = async (req, res, next) => {
  const token = req.body.token || req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const owner = await Owner.findById(decoded.ownerId);

    if (!owner) {
      return res.status(401).json({ error: 'Unauthorized - Invalid owner token' });
    }

    req.user = { role: 'owner', ownerId: decoded.ownerId };
    next();
  } catch (error) {
    console.log(token);
    console.error(error);
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

const authenticateTenant = async (req, res, next) => {
  const token = req.body.token || req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tenant = await Tenant.findById(decoded.tenantId);

    if (!tenant) {
      return res.status(401).json({ error: 'Unauthorized - Invalid tenant token' });
    }

    req.user = { role: 'tenant', tenantId: decoded.tenantId };
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};



const authenticateAdmin = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');

    // Assuming you have an Admin model
    // Adjust the logic based on your actual admin authentication requirements
    const isAdmin = true; // Replace this with your actual admin check logic

    if (!isAdmin) {
      return res.status(403).json({ error: 'Forbidden - Admin access required' });
    }

    req.user = { role: 'admin', adminId: decoded.adminId };
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

const verifyRefreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return next();
  }

  try {
    const decoded = jwt.verify(refreshToken, 'your-refresh-secret-key');
    // Use the decoded information to find the user in the database if necessary

    // Generate a new access token
    const newAccessToken = jwt.sign({ userId: decoded.userId }, 'your-secret-key', { expiresIn: '1h' });
    res.cookie('token', newAccessToken, { httpOnly: true, maxAge: 3600000 }); // 1 hour expiration

    next();
  } catch (error) {
    console.error(error);
    next();
  }
};


module.exports = { authenticateOwner, authenticateTenant, authenticateAdmin,verifyRefreshToken };



