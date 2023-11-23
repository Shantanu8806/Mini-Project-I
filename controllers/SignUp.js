const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Controller function for user signup
const signupUser = async (req, res) => {
  try {
    // Extract user data from the request body
    const { username, password, email, role } = req.body;

    // Check if the username or email is already taken
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(409).json({ error: 'Username or email already in use' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      role, // Set the user role
    });

    // Save the user to the database
    await newUser.save();

    // Generate a JWT token for the newly created user
    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, 'your-secret-key', { expiresIn: '1h' });

    // Return the token in the response
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { signupUser };

