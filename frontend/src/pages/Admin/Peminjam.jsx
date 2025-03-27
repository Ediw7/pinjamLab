import axios from 'axios';
import { useEffect, useState } from 'react';
import Navbar from './Navbar.jsx';

function Peminjam() {
  const [peminjaman, setPeminjaman] = useState([]);
  const [activeTab, setActiveTab] = useState('peminjam');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('tanggal_pinjam');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchPeminjaman();
  }, []);

  const fetchPeminjaman = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/peminjaman`, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setPeminjaman(res.data);
    } catch (err) {
      setError('Error fetching peminjaman: ' + (err.response?.data?.message || 'Server error'));
    } finally {
      setLoading(false);
    }
  };

  const handleKembalikan = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin mengembalikan barang ini?')) return;
    
    setLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/peminjaman/${id}`,
        { tanggal_kembali: new Date().toISOString().slice(0, 10) },
        {
          headers: { Authorization: localStorage.getItem('token') },
        }
      );
      
      // Toast notification instead of alert
      showToast('Barang berhasil dikembalikan', 'success');
      
      setPeminjaman(
        peminjaman.map((item) =>
          item.id_peminjaman === id ? { ...item, status: 'Dikembalikan', tanggal_kembali: new Date().toISOString().slice(0, 10) } : item
        )
      );
    } catch (err) {
      setError('Gagal mengembalikan barang: ' + (err.response?.data?.message || 'Server error'));
    } finally {
      setLoading(false);
    }
  };

  // Simple toast notification
  const showToast = (message, type) => {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    } transition-opacity duration-500`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('opacity-0');
      setTimeout(() => document.body.removeChild(toast), 500);
    }, 3000);
  };

  // Filter and sort peminjaman data
  const filteredPeminjaman = peminjaman
    .filter(item => 
      (statusFilter === 'all' || item.status === statusFilter) &&
      (
        item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nama_barang?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nama_lab?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      // Handle sorting for different fields
      if (sortField === 'tanggal_pinjam') {
        const dateA = new Date(a.tanggal_pinjam);
        const dateB = new Date(b.tanggal_pinjam);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortField === 'nama') {
        return sortOrder === 'asc' 
          ? a.nama?.localeCompare(b.nama || '') 
          : b.nama?.localeCompare(a.nama || '');
      } else if (sortField === 'barang') {
        return sortOrder === 'asc' 
          ? a.nama_barang?.localeCompare(b.nama_barang || '') 
          : b.nama_barang?.localeCompare(a.nama_barang || '');
      } else if (sortField === 'lab') {
        return sortOrder === 'asc' 
          ? a.nama_lab?.localeCompare(b.nama_lab || '') 
          : b.nama_lab?.localeCompare(a.nama_lab || '');
      }
      
      // Default sorting by ID
      return sortOrder === 'asc' ? a.id_peminjaman - b.id_peminjaman : b.id_peminjaman - a.id_peminjaman;
    });

  // Count statistics
  const stats = {
    total: peminjaman.length,
    dipinjam: peminjaman.filter(item => item.status === 'Dipinjam').length,
    dikembalikan: peminjaman.filter(item => item.status === 'Dikembalikan').length
  };

  // Toggle sort order
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          Manajemen Peminjaman
        </h1>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
            <p>{error}</p>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
            <p className="text-sm font-medium text-gray-500">Total Peminjaman</p>
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
            <p className="text-sm font-medium text-gray-500">Sedang Dipinjam</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.dipinjam}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
            <p className="text-sm font-medium text-gray-500">Sudah Dikembalikan</p>
            <p className="text-2xl font-bold text-green-600">{stats.dikembalikan}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Filter and Search Bar */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Daftar Peminjam
              </h3>
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari peminjam, barang..."
                    className="pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-2 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <select
                  className="pl-4 pr-8 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Semua Status</option>
                  <option value="Dipinjam">Dipinjam</option>
                  <option value="Dikembalikan">Dikembalikan</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredPeminjaman.length === 0 && (
            <div className="text-center py-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada data peminjaman</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? "Tidak ada hasil yang cocok dengan filter Anda" 
                  : "Belum ada data peminjaman yang tersedia"}
              </p>
            </div>
          )}

          {/* Table */}
          {!loading && filteredPeminjaman.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center">
                        ID
                        {sortField === 'id' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortOrder === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th 
                      className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('lab')}
                    >
                      <div className="flex items-center">
                        Nama Lab
                        {sortField === 'lab' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortOrder === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok Total</th>
                    <th 
                      className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('tanggal_pinjam')}
                    >
                      <div className="flex items-center">
                        Tanggal Pinjam
                        {sortField === 'tanggal_pinjam' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortOrder === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                          </svg>
                        )}
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPeminjaman.map((item) => (
                    <tr key={item.id_peminjaman} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">{item.id_peminjaman}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{item.nama}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{item.nama_barang}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{item.nama_lab}</td>
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
                          {item.status || 'Tidak Diketahui'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {item.status === 'Dipinjam' && (
                          <button
                            onClick={() => handleKembalikan(item.id_peminjaman)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            disabled={loading}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Kembalikan
                          </button>
                        )}
                        {item.status === 'Dikembalikan' && (
                          <span className="text-xs text-gray-500">
                            Dikembalikan pada: {new Date(item.tanggal_kembali).toLocaleDateString('id-ID')}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination (if needed) */}
          {!loading && filteredPeminjaman.length > 0 && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Menampilkan <span className="font-medium">1</span> sampai <span className="font-medium">{filteredPeminjaman.length}</span> dari <span className="font-medium">{filteredPeminjaman.length}</span> peminjaman
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Peminjam;