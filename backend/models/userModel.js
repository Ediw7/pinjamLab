const db = require('../config/database');

const User = {
    // Register user
    create: (userData, callback) => {
        const { username, password, role, nama } = userData;
        db.query(
            'INSERT INTO users (username, password, role, nama) VALUES (?, ?, ?, ?)',
            [username, password, role, nama],
            (err, result) => {
                if (err) return callback(err);
                callback(null, { id: result.insertId });
            }
        );
    },

    // Find user by username
    findByUsername: (username, callback) => {
        db.query(
            'SELECT * FROM users WHERE username = ?',
            [username],
            (err, results) => {
                if (err) return callback(err);
                callback(null, results[0]);
            }
        );
    }
};

module.exports = User;