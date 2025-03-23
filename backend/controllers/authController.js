const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Register
const register = (req, res) => {
    const { username, password, role, nama } = req.body;

    if (!['admin', 'mahasiswa'].includes(role)) {
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

// Login
const login = (req, res) => {
    const { username, password } = req.body;

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

module.exports = { register, login };