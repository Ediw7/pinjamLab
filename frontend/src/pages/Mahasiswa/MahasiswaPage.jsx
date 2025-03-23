import { useState, useEffect } from 'react';
import axios from 'axios';

function MahasiswaPage() {
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState('');
  const [barang, setBarang] = useState([]);
  const [selectedBarang, setSelectedBarang] = useState('');
  const [jumlah, setJumlah] = useState('');
  const [tanggalPinjam, setTanggalPinjam] = useState('');

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

  const handlePinjam = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:3000/api/peminjaman`,
        {
          id_barang: selectedBarang,
          jumlah,
          tanggal_pinjam: tanggalPinjam,
        },
        { headers: { Authorization: localStorage.getItem('token') } }
      );
      alert(`Peminjaman berhasil! ID: ${res.data.id}`);
      setSelectedBarang('');
      setJumlah('');
      setTanggalPinjam('');
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
      <h2>Mahasiswa Page</h2>
      <button onClick={handleLogout}>Logout</button>
      <h3>Pinjam Barang</h3>
      <form onSubmit={handlePinjam}>
        <div>
          <label>Pilih Lab:</label>
          <select
            value={selectedLab}
            onChange={(e) => setSelectedLab(e.target.value)}
          >
            <option value="">-- Pilih Lab --</option>
            {labs.map((lab) => (
              <option key={lab.id_lab} value={lab.id_lab}>
                {lab.nama_lab}
              </option>
            ))}
          </select>
        </div>

        {selectedLab && (
          <div>
            <label>Pilih Barang:</label>
            <select
              value={selectedBarang}
              onChange={(e) => setSelectedBarang(e.target.value)}
            >
              <option value="">-- Pilih Barang --</option>
              {barang.map((item) => (
                <option key={item.id_barang} value={item.id_barang}>
                  {item.nama_barang} (Stok: {item.stok})
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedBarang && (
          <>
            <div>
              <label>Jumlah:</label>
              <input
                type="number"
                placeholder="Jumlah"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
                min="1"
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
          </>
        )}

        <button type="submit" disabled={!selectedBarang || !jumlah || !tanggalPinjam}>
          Pinjam
        </button>
      </form>
    </div>
  );
}

export default MahasiswaPage;