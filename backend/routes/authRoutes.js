const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, department, employeeId } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ name, email, password: hashedPassword, department, employeeId });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'User exists or error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      role: user.role,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' }),
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;