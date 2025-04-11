const db = require('../config/database');

const Peminjaman = {
  findByUserId: (id_user, callback) => {
    const query = `
      SELECT 
        p.id_peminjaman, 
        b.nama_barang, 
        p.jumlah, 
        p.tanggal_pinjam, 
        p.tanggal_kembali, 
        CASE 
          WHEN p.tanggal_kembali IS NULL THEN 'dipinjam' 
          ELSE 'dikembalikan' 
        END AS status
      FROM peminjaman p
      JOIN barang b ON p.id_barang = b.id_barang
      WHERE p.id_user = ? AND p.is_deleted = 0  -- Diperbaiki dari deleted_at ke is_deleted
    `;
    db.query(query, [id_user], callback);
  },

  // Create peminjaman
  create: (peminjamanData, callback) => {
    const { id_user, id_barang, jumlah, tanggal_pinjam } = peminjamanData;
    db.query(
      'INSERT INTO peminjaman (id_user, id_barang, jumlah, tanggal_pinjam) VALUES (?, ?, ?, ?)',
      [id_user, id_barang, jumlah, tanggal_pinjam],
      (err, result) => {
        if (err) return callback(err);
        callback(null, { id: result.insertId });
      }
    );
  },

  // Get all peminjaman
  findAll: (callback) => {
    db.query(
      'SELECT p.id_peminjaman, u.nama, b.nama_barang, l.nama_lab, p.jumlah, p.tanggal_pinjam, p.tanggal_kembali, b.stok, ' +
      'CASE WHEN p.tanggal_kembali IS NULL THEN "Dipinjam" ELSE "Dikembalikan" END AS status ' +
      'FROM peminjaman p ' +
      'JOIN users u ON p.id_user = u.id_user ' +
      'JOIN barang b ON p.id_barang = b.id_barang ' +
      'JOIN lab l ON b.id_lab = l.id_lab ' +
      'WHERE p.is_deleted = 0',
      (err, results) => {
        if (err) return callback(err);
        callback(null, results);
      }
    );
  },

  // Update peminjaman
  update: (id, tanggal_kembali, callback) => {
    db.query(
      'UPDATE peminjaman SET tanggal_kembali = ? WHERE id_peminjaman = ? AND is_deleted = 0',
      [tanggal_kembali, id],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result);
      }
    );
  },

  // Delete peminjaman (soft delete)
  delete: (id, callback) => {
    db.query(
      'UPDATE peminjaman SET is_deleted = 1 WHERE id_peminjaman = ?',
      [id],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result);
      }
    );
  },

  // Search barang
  searchBarang: (query, callback) => {
    db.query(
      'SELECT b.id_barang, b.nama_barang, l.nama_lab, b.stok, b.gambar ' +
      'FROM barang b ' +
      'JOIN lab l ON b.id_lab = l.id_lab ' +
      'WHERE b.nama_barang LIKE ? AND b.is_deleted = 0',
      [`%${query}%`],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results);
      }
    );
  },

  getLabs: (callback) => {
    db.query('SELECT id_lab, nama_lab FROM lab', (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  getBarangByLab: (id_lab, callback) => {
    db.query(
      'SELECT b.id_barang, b.nama_barang, b.stok, b.gambar, l.nama_lab, COALESCE(SUM(p.jumlah), 0) as dipinjam ' +
      'FROM barang b ' +
      'JOIN lab l ON b.id_lab = l.id_lab ' +
      'LEFT JOIN peminjaman p ON b.id_barang = p.id_barang AND p.tanggal_kembali IS NULL AND p.is_deleted = 0 ' +
      'WHERE b.id_lab = ? AND b.is_deleted = 0 ' +
      'GROUP BY b.id_barang, b.nama_barang, b.stok, b.gambar, l.nama_lab',
      [id_lab],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results);
      }
    );
  },

  createLab: (labData, callback) => {
    const { nama_lab, deskripsi } = labData;
    db.query(
      'INSERT INTO lab (nama_lab, deskripsi) VALUES (?, ?)',
      [nama_lab, deskripsi],
      (err, result) => {
        if (err) return callback(err);
        callback(null, { id: result.insertId });
      }
    );
  },

  createBarang: (barangData, callback) => {
    const { id_lab, nama_barang, stok, gambar } = barangData;
    db.query(
      'INSERT INTO barang (id_lab, nama_barang, stok, gambar) VALUES (?, ?, ?, ?)',
      [id_lab, nama_barang, stok, gambar],
      (err, result) => {
        if (err) return callback(err);
        callback(null, { id: result.insertId });
      }
    );
  },

  updateBarang: (id, barangData, callback) => {
    const { nama_barang, stok, gambar } = barangData;
    db.query(
      'UPDATE barang SET nama_barang = ?, stok = ?, gambar = ? WHERE id_barang = ? AND is_deleted = 0',
      [nama_barang, stok, gambar, id],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result);
      }
    );
  },

  deleteBarang: (id, callback) => {
    db.query(
      'UPDATE barang SET is_deleted = 1 WHERE id_barang = ?',
      [id],
      (err, result) => {
        if (err) return callback(err);
        callback(null, result);
      }
    );
  },
};

module.exports = Peminjaman;