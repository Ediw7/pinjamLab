import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar.jsx';

function KelolaLab() {
  const [newLab, setNewLab] = useState({ nama_lab: '', deskripsi: '' });
  const [labs, setLabs] = useState([]);
  const [activeTab, setActiveTab] = useState('lab');

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="container mx-auto px-6 pt-20 pb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tambah Lab Baru</h3>
          <form onSubmit={handleAddLab} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lab</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan nama lab"
                value={newLab.nama_lab}
                onChange={(e) => setNewLab({ ...newLab, nama_lab: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan deskripsi"
                value={newLab.deskripsi}
                onChange={(e) => setNewLab({ ...newLab, deskripsi: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Tambah Lab
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default KelolaLab;