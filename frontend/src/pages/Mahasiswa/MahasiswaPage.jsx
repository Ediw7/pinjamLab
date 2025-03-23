import { useState, useEffect } from 'react';
import axios from 'axios';

function MahasiswaPage() {
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState('');
  const [barang, setBarang] = useState([]);
  const [selectedBarang, setSelectedBarang] = useState(null); // Untuk menyimpan barang yang dipilih
  const [jumlah, setJumlah] = useState('');
  const [tanggalPinjam, setTanggalPinjam] = useState('');

  // Ambil daftar lab
  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/labs`, {
          headers: { Authorization: localStorage.getItem('token') },
        });
        setLabs(res.data);
      } catch (err) {
        alert('Error fetching labs: ' + (err.response?.data?.message || 'Server error'));
      }
    };
    fetchLabs();
  }, []);

  // Ambil barang berdasarkan lab
  useEffect(() => {
    if (selectedLab) {
      const fetchBarang = async () => {
        try {
          const res = await axios.get(`http://localhost:3000/api/barang/lab/${selectedLab}`, {
            headers: { Authorization: localStorage.getItem('token') },
          });
          setBarang(res.data);
        } catch (err) {
          alert('Error fetching barang: ' + (err.response?.data?.message || 'Server error'));
        }
      };
      fetchBarang();
    }
  }, [selectedLab]);

  // Handle peminjaman
  const handlePinjam = async (e) => {
    e.preventDefault();
    if (!selectedBarang) {
      alert('Pilih barang terlebih dahulu!');
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:3000/api/peminjaman`,
        {
          id_barang: selectedBarang.id_barang,
          jumlah,
          tanggal_pinjam: tanggalPinjam,
        },
        { headers: { Authorization: localStorage.getItem('token') } }
      );
      alert(`Peminjaman berhasil! ID: ${res.data.id}`);
      setSelectedBarang(null);
      setJumlah('');
      setTanggalPinjam('');
      // Refresh tabel barang
      const resBarang = await axios.get(`http://localhost:3000/api/barang/lab/${selectedLab}`, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setBarang(resBarang.data);
    } catch (err) {
      alert('Pinjam failed: ' + (err.response?.data?.message || 'Server error'));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div>
      <h2>Mahasiswa Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>

      {/* Pilih Lab */}
      <div>
        <h3>Pilih Lab</h3>
        <select value={selectedLab} onChange={(e) => setSelectedLab(e.target.value)}>
          <option value="">-- Pilih Lab --</option>
          {labs.map((lab) => (
            <option key={lab.id_lab} value={lab.id_lab}>
              {lab.nama_lab}
            </option>
          ))}
        </select>
      </div>

      {/* Tabel Barang */}
      {selectedLab && (
        <div>
          <h3>Daftar Barang di {labs.find((l) => l.id_lab === selectedLab)?.nama_lab}</h3>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '8px' }}>Nama Barang</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Stok</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Sedang Dipinjam</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {barang.map((item) => (
                <tr key={item.id_barang}>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{item.nama_barang}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{item.stok}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{item.dipinjam}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <button
                      onClick={() => setSelectedBarang(item)}
                      disabled={item.stok - item.dipinjam <= 0}
                    >
                      Pinjam
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Peminjaman */}
      {selectedBarang && (
        <div>
          <h3>Pinjam Barang: {selectedBarang.nama_barang}</h3>
          <form onSubmit={handlePinjam}>
            <div>
              <label>Jumlah (Max: {selectedBarang.stok - selectedBarang.dipinjam}):</label>
              <input
                type="number"
                placeholder="Jumlah"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
                min="1"
                max={selectedBarang.stok - selectedBarang.dipinjam}
              />
            </div>
            <div>
              <label>Tanggal Pinjam:</label>
              <input
                type="date"
                value={tanggalPinjam}
                onChange={(e) => setTanggalPinjam(e.target.value)}
              />
            </div>
            <button type="submit">Pinjam Sekarang</button>
            <button onClick={() => setSelectedBarang(null)}>Batal</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default MahasiswaPage;