import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar.jsx';

function Peminjam() {
  const [peminjaman, setPeminjaman] = useState([]);
  const [activeTab, setActiveTab] = useState('peminjam');

  useEffect(() => {
    const fetchPeminjaman = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/peminjaman`, {
          headers: { Authorization: localStorage.getItem('token') },
        });
        setPeminjaman(res.data);
      } catch (err) {
        alert('Error fetching peminjaman: ' + (err.response?.data?.message || 'Server error'));
      }
    };
    fetchPeminjaman();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="container mx-auto px-6 pt-20 pb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Daftar Peminjam</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Mahasiswa
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Barang
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stok Total
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Pinjam
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {peminjaman.length > 0 ? (
                  peminjaman.map((item) => (
                    <tr key={item.id_peminjaman}>
                      <td className="py-3 px-4 text-sm text-gray-900">{item.id_peminjaman}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{item.nama_mahasiswa}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{item.nama_barang}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{item.jumlah}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{item.stok}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {new Date(item.tanggal_pinjam).toLocaleDateString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            item.status === 'Dipinjam'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-4 px-4 text-center text-sm text-gray-500">
                      Belum ada data peminjaman
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Peminjam;