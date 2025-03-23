import { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPage() {
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState('');
  const [barang, setBarang] = useState([]);
  const [newLab, setNewLab] = useState({ nama_lab: '', deskripsi: '' });
  const [newBarang, setNewBarang] = useState({ id_lab: '', nama_barang: '', stok: '' });
  const [editBarang, setEditBarang] = useState(null);

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

  // Tambah lab
  const handleAddLab = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:3000/api/lab`, newLab, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      alert(`Lab added! ID: ${res.data.id}`);
      setNewLab({ nama_lab: '', deskripsi: '' });
      setLabs([...labs, { id_lab: res.data.id, nama_lab: newLab.nama_lab }]);
    } catch (err) {
      alert('Add lab failed: ' + (err.response?.data?.message || 'Server error'));
    }
  };

  // Tambah barang
  const handleAddBarang = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:3000/api/barang`, newBarang, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      alert(`Barang added! ID: ${res.data.id}`);
      if (newBarang.id_lab === selectedLab) {
        setBarang([...barang, { id_barang: res.data.id, nama_barang: newBarang.nama_barang, stok: newBarang.stok }]);
      }
      setNewBarang({ id_lab: '', nama_barang: '', stok: '' });
    } catch (err) {
      alert('Add barang failed: ' + (err.response?.data?.message || 'Server error'));
    }
  };

  // Edit barang
  const handleEditBarang = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/barang/${editBarang.id_barang}`, editBarang, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      alert('Barang updated');
      setBarang(barang.map((b) => (b.id_barang === editBarang.id_barang ? editBarang : b)));
      setEditBarang(null);
    } catch (err) {
      alert('Edit barang failed: ' + (err.response?.data?.message || 'Server error'));
    }
  };

  // Hapus barang
  const handleDeleteBarang = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/barang/${id}`, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      alert('Barang deleted');
      setBarang(barang.filter((b) => b.id_barang !== id));
    } catch (err) {
      alert('Delete barang failed: ' + (err.response?.data?.message || 'Server error'));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
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
                <th style={{ border: '1px solid black', padding: '8px' }}>ID Barang</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Nama Barang</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Stok</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Sedang Dipinjam</th>
                <th style={{ border: '1px solid black', padding: '8px' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {barang.map((item) => (
                <tr key={item.id_barang}>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{item.id_barang}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{item.nama_barang}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{item.stok}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>{item.dipinjam}</td>
                  <td style={{ border: '1px solid black', padding: '8px' }}>
                    <button onClick={() => setEditBarang(item)}>Edit</button>
                    <button onClick={() => handleDeleteBarang(item.id_barang)}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Tambah Lab */}
      <div>
        <h3>Tambah Lab Baru</h3>
        <form onSubmit={handleAddLab}>
          <input
            type="text"
            placeholder="Nama Lab"
            value={newLab.nama_lab}
            onChange={(e) => setNewLab({ ...newLab, nama_lab: e.target.value })}
          />
          <input
            type="text"
            placeholder="Deskripsi"
            value={newLab.deskripsi}
            onChange={(e) => setNewLab({ ...newLab, deskripsi: e.target.value })}
          />
          <button type="submit">Tambah Lab</button>
        </form>
      </div>

      {/* Form Tambah Barang */}
      <div>
        <h3>Tambah Barang Baru</h3>
        <form onSubmit={handleAddBarang}>
          <select
            value={newBarang.id_lab}
            onChange={(e) => setNewBarang({ ...newBarang, id_lab: e.target.value })}
          >
            <option value="">-- Pilih Lab --</option>
            {labs.map((lab) => (
              <option key={lab.id_lab} value={lab.id_lab}>
                {lab.nama_lab}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Nama Barang"
            value={newBarang.nama_barang}
            onChange={(e) => setNewBarang({ ...newBarang, nama_barang: e.target.value })}
          />
          <input
            type="number"
            placeholder="Stok"
            value={newBarang.stok}
            onChange={(e) => setNewBarang({ ...newBarang, stok: e.target.value })}
          />
          <button type="submit">Tambah Barang</button>
        </form>
      </div>

      {/* Form Edit Barang */}
      {editBarang && (
        <div>
          <h3>Edit Barang</h3>
          <form onSubmit={handleEditBarang}>
            <input
              type="text"
              value={editBarang.nama_barang}
              onChange={(e) => setEditBarang({ ...editBarang, nama_barang: e.target.value })}
            />
            <input
              type="number"
              value={editBarang.stok}
              onChange={(e) => setEditBarang({ ...editBarang, stok: e.target.value })}
            />
            <button type="submit">Simpan</button>
            <button onClick={() => setEditBarang(null)}>Batal</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminPage;