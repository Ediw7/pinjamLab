import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar.jsx';

function AdminPage() {
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState('');
  const [barang, setBarang] = useState([]);
  const [editBarang, setEditBarang] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

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
          {/* Pilih Lab */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pilih Lab</h3>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
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

          {/* Form Edit Barang */}
          {editBarang && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Barang</h3>
              <form onSubmit={handleEditBarang} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={editBarang.nama_barang}
                    onChange={(e) => setEditBarang({ ...editBarang, nama_barang: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={editBarang.stok}
                    onChange={(e) => setEditBarang({ ...editBarang, stok: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link Gambar</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={editBarang.gambar || ''}
                    onChange={(e) => setEditBarang({ ...editBarang, gambar: e.target.value })}
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    onClick={() => setEditBarang(null)}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tabel Barang */}
          {selectedLab && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Daftar Barang di {labs.find((l) => l.id_lab === selectedLab)?.nama_lab}
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID Barang
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gambar
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama Barang
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stok
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sedang Dipinjam
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {barang.length > 0 ? (
                      barang.map((item) => (
                        <tr key={item.id_barang}>
                          <td className="py-3 px-4 text-sm text-gray-900">{item.id_barang}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">
                            <img
                              src={item.gambar || 'https://via.placeholder.com/100'}
                              alt={item.nama_barang}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900">{item.nama_barang}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">{item.stok}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">{item.dipinjam}</td>
                          <td className="py-3 px-4 text-sm">
                            <button
                              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2 transition-colors"
                              onClick={() => setEditBarang(item)}
                            >
                              Edit
                            </button>
                            <button
                              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                              onClick={() => handleDeleteBarang(item.id_barang)}
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="py-4 px-4 text-center text-sm text-gray-500">
                          Tidak ada barang di lab ini
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          
        </div>
      </div>
    </div>
  );
}

export default AdminPage;