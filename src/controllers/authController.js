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
      { id: newUser._id },
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


const loginUser = async(req,res) => {
  const {email, password} = req.body;

  try {
    const user = await User.findOne({email});

    const token = jwt.sign({email: email}, process.env.JWT_SECRET, {expiresIn: '24h'} )

    res.status(200).json({
      status: true,
      message: 'User logged in successfully', 
      token: `Bearer ${token}`,
      data: {
        user: user
      },
      meta: {}
    })
  } catch (error) {
    res.status(500).json({success: false, message:error.message});
  }
}
  
module.exports = {registerUser, loginUser}