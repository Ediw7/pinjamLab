const Peminjaman = require('../models/peminjamanModel');

// Create Peminjaman (khusus mahasiswa)
const createPeminjaman = (req, res) => {
    const { id_barang, jumlah } = req.body;
    const tanggal_pinjam = new Date().toISOString().slice(0, 10);

    Peminjaman.create({ id_user: req.user.id, id_barang, jumlah, tanggal_pinjam }, (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json({ message: 'Peminjaman berhasil', id: result.id });
    });
};

// Read semua peminjaman (khusus admin)
const getAllPeminjaman = (req, res) => {
    Peminjaman.findAll((err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json(results);
    });
};

// Update Peminjaman (khusus admin)
const updatePeminjaman = (req, res) => {
    const { id } = req.params;
    const tanggal_kembali = new Date().toISOString().slice(0, 10);

    Peminjaman.update(id, tanggal_kembali, (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Peminjaman tidak ditemukan' });
        res.json({ message: 'Peminjaman berhasil dikembalikan' });
    });
};

// Delete Peminjaman (soft delete, khusus admin)
const deletePeminjaman = (req, res) => {
    const { id } = req.params;

    Peminjaman.delete(id, (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Peminjaman tidak ditemukan' });
        res.json({ message: 'Peminjaman berhasil dihapus (soft delete)' });
    });
};

// Search Barang
const searchBarang = (req, res) => {
    const { q } = req.query;

    Peminjaman.searchBarang(q, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err });
        res.json(results);
    });
};

const getLabs = (req, res) => {
    Peminjaman.getLabs((err, results) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });
      res.json(results);
    });
  };
  
  const getBarangByLab = (req, res) => {
    const { id_lab } = req.params;
    Peminjaman.getBarangByLab(id_lab, (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });
      res.json(results);
    });
  };
  
  const createLab = (req, res) => {
    const { nama_lab, deskripsi } = req.body;
    Peminjaman.createLab({ nama_lab, deskripsi }, (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });
      res.status(201).json({ message: 'Lab created', id: result.id });
    });
  };
  
  const createBarang = (req, res) => {
    const { id_lab, nama_barang, stok } = req.body;
    Peminjaman.createBarang({ id_lab, nama_barang, stok }, (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });
      res.status(201).json({ message: 'Barang created', id: result.id });
    });
  };
  
  const updateBarang = (req, res) => {
    const { id } = req.params;
    const { nama_barang, stok } = req.body;
    Peminjaman.updateBarang(id, { nama_barang, stok }, (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Barang not found' });
      res.json({ message: 'Barang updated' });
    });
  };
  
  const deleteBarang = (req, res) => {
    const { id } = req.params;
    Peminjaman.deleteBarang(id, (err, result) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'Barang not found' });
      res.json({ message: 'Barang deleted (soft delete)' });
    });
  };
  
  module.exports = {
    createPeminjaman,
    getAllPeminjaman,
    updatePeminjaman,
    deletePeminjaman,
    searchBarang,
    getLabs,
    getBarangByLab,
    createLab,
    createBarang,
    updateBarang,
    deleteBarang,
  };