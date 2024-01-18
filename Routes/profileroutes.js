const express = require('express');
const router = express.Router();
const { signUpOwner, signUpTenant } = require('../controllers/SignUp');
const { loginTenant, loginOwner } = require('../controllers/Login');
const { authenticateAdmin, authenticateOwner, authenticateTenant } = require('../middlewares/auth');

// Routes for owner signup and tenant signup
router.post('/signup/owner', signUpOwner);
router.post('/signup/tenant', signUpTenant);

// Routes for owner login and tenant login with authentication middleware
router.post('/login/owner',loginOwner);
router.post('/login/tenant',loginTenant);

// Protected route example for owner (requires owner role)
router.get('/owner/dashboard', authenticateOwner, (req, res) => {
  // Your protected owner route logic goes here
  res.json({ message: 'Owner dashboard' });
});

// Protected route example for tenant (requires tenant role)
router.get('/tenant/dashboard', authenticateTenant, (req, res) => {
  // Your protected tenant route logic goes here
  res.json({ message: 'Tenant dashboard' });
});

// Protected route example for admin (requires admin role)
router.get('/admin/dashboard', authenticateAdmin, (req, res) => {
  // Your protected admin route logic goes here
  res.json({ message: 'Admin dashboard' });
});

module.exports = router;
