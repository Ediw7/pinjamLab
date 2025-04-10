const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const peminjamanController = require('../controllers/peminjamanController');
const { authenticateToken, checkRole } = require('../middleware/auth');

// Auth Routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-token', authController.verifyToken);

// Peminjaman Routes
router.post('/peminjaman', authenticateToken, checkRole('mahasiswa'), peminjamanController.createPeminjaman);
router.get('/peminjaman', authenticateToken, checkRole('admin'), peminjamanController.getAllPeminjaman);
router.put('/peminjaman/:id', authenticateToken, checkRole('admin'), peminjamanController.updatePeminjaman);
router.delete('/peminjaman/:id', authenticateToken, checkRole('admin'), peminjamanController.deletePeminjaman);
router.get('/barang/search', authenticateToken, peminjamanController.searchBarang);
router.get('/labs', authenticateToken, peminjamanController.getLabs);
router.get('/barang/lab/:id_lab', authenticateToken, peminjamanController.getBarangByLab);
router.get('/peminjaman/mahasiswa', authenticateToken, peminjamanController.getPeminjamanMahasiswa);

// Admin Routes (Baru)
router.post('/lab', authenticateToken, checkRole('admin'), peminjamanController.createLab);
router.post('/barang', authenticateToken, checkRole('admin'), peminjamanController.createBarang);
router.put('/barang/:id', authenticateToken, checkRole('admin'), peminjamanController.updateBarang);
router.delete('/barang/:id', authenticateToken, checkRole('admin'), peminjamanController.deleteBarang);

module.exports = router;
