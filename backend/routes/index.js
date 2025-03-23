const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const peminjamanController = require('../controllers/peminjamanController');
const { authenticateToken, checkRole } = require('../middleware/auth');

// Auth Routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Peminjaman Routes
router.post('/peminjaman', authenticateToken, checkRole('mahasiswa'), peminjamanController.createPeminjaman);
router.get('/peminjaman', authenticateToken, checkRole('admin'), peminjamanController.getAllPeminjaman);
router.put('/peminjaman/:id', authenticateToken, checkRole('admin'), peminjamanController.updatePeminjaman);
router.delete('/peminjaman/:id', authenticateToken, checkRole('admin'), peminjamanController.deletePeminjaman);
router.get('/barang/search', authenticateToken, peminjamanController.searchBarang);

module.exports = router;