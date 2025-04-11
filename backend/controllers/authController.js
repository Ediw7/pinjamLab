const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const register = (req, res) => {
    const { username, password, nama } = req.body;
    const role = "mahasiswa";

  if (!username || !password || !role || !nama) {
    return res.status(400).json({ message: 'Semua field harus diisi' });
  }
  if (!['admin', 'mahasiswa', 'user'].includes(role)) { // Tambahkan 'user'
    return res.status(400).json({ message: 'Invalid role' });
  }

  User.findByUsername(username, (err, existingUser) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });

    User.create({ username, password, role, nama }, (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });
      res.status(201).json({ message: 'User registered', id: result.id });
    });
  });
};

// Login dan Verify Token tetap sama
const login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password harus diisi' });
  }
  User.findByUsername(username, (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (password !== user.password) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign(
      { id: user.id_user, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ message: 'Login successful', token, role: user.role });
  });
};

const verifyToken = (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token', error: err });
    }
    res.status(200).json({ role: data.role });
  });
};

module.exports = { register, login, verifyToken };