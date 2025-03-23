const db = require('../config/database');

const Peminjaman = {
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
            'SELECT p.id_peminjaman, u.nama, b.nama_barang, l.nama_lab, p.jumlah, p.tanggal_pinjam, p.tanggal_kembali ' +
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
            'SELECT b.id_barang, b.nama_barang, l.nama_lab, b.stok ' +
            'FROM barang b ' +
            'JOIN lab l ON b.id_lab = l.id_lab ' +
            'WHERE b.nama_barang LIKE ? AND b.is_deleted = 0',
            [`%${query}%`],
            (err, results) => {
                if (err) return callback(err);
                callback(null, results);
            }
        );
    }
};

module.exports = Peminjaman;