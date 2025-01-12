const User = require("../models/user");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const registerUser =  async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    const newUser = new User({...req.body, password: hashedPassword});
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign(
      {email, id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Token expires in 1 hour
    );

    res.status(201).json({
      message: 'User registered successfully',
      token: `Bearer ${token}`,
      data: {
        user: newUser
      },
      meta: {}
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please check your email or register.',
      });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please try again.',
      });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Respond with user details and token
    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      token: `Bearer ${token}`,
      data: {
        user: user
      },
      meta: {},
    });
  } catch (error) {
    // Handle server errors
    res.status(500).json({
      success: false,
      message: 'An error occurred during login.',
      error: error.message,
    });
  }
};
module.exports = {registerUser, loginUser}