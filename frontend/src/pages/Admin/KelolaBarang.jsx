import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar.jsx';

function KelolaBarang() {
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState('');
  const [barang, setBarang] = useState([]);
  const [newBarang, setNewBarang] = useState({ id_lab: '', nama_barang: '', stok: '', gambar: '' });
  const [editBarang, setEditBarang] = useState(null);
  const [activeTab, setActiveTab] = useState('barang');

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

  const handleAddBarang = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:3000/api/barang`,
        {
          id_lab: newBarang.id_lab,
          nama_barang: newBarang.nama_barang,
          stok: newBarang.stok,
          gambar: newBarang.gambar,
        },
        {
          headers: { Authorization: localStorage.getItem('token') },
        }
      );
      alert(`Barang added! ID: ${res.data.id}`);
      if (newBarang.id_lab === selectedLab) {
        setBarang([
          ...barang,
          { id_barang: res.data.id, nama_barang: newBarang.nama_barang, stok: newBarang.stok, gambar: newBarang.gambar },
        ]);
      }
      setNewBarang({ id_lab: '', nama_barang: '', stok: '', gambar: '' });
    } catch (err) {
      alert('Add barang failed: ' + (err.response?.data?.message || 'Server error'));
    }
  };

  const handleEditBarang = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3000/api/barang/${editBarang.id_barang}`,
        {
          nama_barang: editBarang.nama_barang,
          stok: editBarang.stok,
          gambar: editBarang.gambar,
        },
        {
          headers: { Authorization: localStorage.getItem('token') },
        }
      );
      alert('Barang updated');
      setBarang(barang.map((b) => (b.id_barang === editBarang.id_barang ? editBarang : b)));
      setEditBarang(null);
    } catch (err) {
      alert('Edit barang failed: ' + (err.response?.data?.message || 'Server error'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="container mx-auto px-6 pt-20 pb-6">
        <div className="space-y-6">
          {/* Form Tambah Barang */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tambah Barang Baru</h3>
            <form onSubmit={handleAddBarang} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Lab</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Masukkan nama barang"
                  value={newBarang.nama_barang}
                  onChange={(e) => setNewBarang({ ...newBarang, nama_barang: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                <input
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Masukkan stok"
                  value={newBarang.stok}
                  onChange={(e) => setNewBarang({ ...newBarang, stok: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link Gambar</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Masukkan URL gambar"
                  value={newBarang.gambar}
                  onChange={(e) => setNewBarang({ ...newBarang, gambar: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Tambah Barang
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KelolaBarang;