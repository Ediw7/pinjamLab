import { useState, useEffect } from 'react';
import axios from 'axios';
import MahasiswaNavbar from './MahasiswaNavbar.jsx';

function MahasiswaPage() {
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState('');
  const [barang, setBarang] = useState([]);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [jumlah, setJumlah] = useState(1);
  const [tanggalPinjam, setTanggalPinjam] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [peminjaman, setPeminjaman] = useState([]);
  const [activeTab, setActiveTab] = useState('peminjaman');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Set default date to today
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setTanggalPinjam(formattedDate);
  }, []);

  // Fetch labs data
  useEffect(() => {
    const fetchLabs = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/labs`, {
          headers: { Authorization: localStorage.getItem('token') },
        });
        setLabs(res.data);
        if (res.data.length > 0) {
          setSelectedLab(res.data[0].id_lab);
        }
      } catch (err) {
        showNotification('Error mengambil data lab', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLabs();
    fetchPeminjaman();
  }, []);

  // Fetch items based on selected lab
  useEffect(() => {
    if (selectedLab) {
      fetchBarang();
    }
  }, [selectedLab]);

  const fetchBarang = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/barang/lab/${selectedLab}`, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setBarang(res.data);
    } catch (err) {
      showNotification('Error mengambil data barang', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPeminjaman = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/peminjaman/mahasiswa`, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setPeminjaman(res.data);
    } catch (err) {
      showNotification('Error mengambil riwayat peminjaman', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinjam = async (e) => {
    e.preventDefault();
    if (!selectedBarang) {
      showNotification('Pilih barang terlebih dahulu!', 'error');
      return;
    }

    if (!jumlah || jumlah < 1) {
      showNotification('Jumlah harus diisi dengan benar', 'error');
      return;
    }

    if (!tanggalPinjam) {
      showNotification('Tanggal pinjam harus diisi', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/peminjaman`,
        {
          id_barang: selectedBarang.id_barang,
          jumlah,
          tanggal_pinjam: tanggalPinjam,
        },
        { headers: { Authorization: localStorage.getItem('token') } }
      );

      showNotification(`Peminjaman berhasil! ID: ${res.data.id}`, 'success');
      setSelectedBarang(null);
      setJumlah(1);

      // Refresh data
      fetchBarang();
      fetchPeminjaman();
    } catch (err) {
      showNotification(`Peminjaman gagal: ${err.response?.data?.message || 'Server error'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 5000);
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'dipinjam':
        return 'bg-yellow-100 text-yellow-800';
      case 'dikembalikan':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <MahasiswaNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="container mx-auto px-4 py-6">
        {notification.show && (
          <div
            className={`mb-4 p-4 rounded-md ${
              notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}
          >
            {notification.message}
          </div>
        )}

        {activeTab === 'peminjaman' && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Pinjam Alat Laboratorium</h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Lab</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={selectedLab}
                  onChange={(e) => setSelectedLab(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="">-- Pilih Lab --</option>
                  {labs.map((lab) => (
                    <option key={lab.id_lab} value={lab.id_lab}>
                      {lab.nama_lab}
                    </option>
                  ))}
                </select>
              </div>

              {isLoading ? (
                <div className="flex justify-center my-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : selectedLab ? (
                <div className="overflow-x-auto">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">
                    Daftar Barang di {labs.find((l) => l.id_lab === selectedLab)?.nama_lab}
                  </h3>
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gambar
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nama Barang
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stok Total
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tersedia
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
                            <td className="py-3 px-4 text-sm text-gray-900">
                              <img
                                src={item.gambar || 'https://via.placeholder.com/100'}
                                alt={item.nama_barang}
                                className="w-16 h-16 object-cover rounded-md"
                              />
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900">{item.nama_barang}</td>
                            <td className="py-3 px-4 text-sm text-gray-900">{item.stok}</td>
                            <td className="py-3 px-4 text-sm text-gray-900">{item.stok - item.dipinjam}</td>
                            <td className="py-3 px-4 text-sm">
                              <button
                                onClick={() => setSelectedBarang(item)}
                                disabled={item.stok - item.dipinjam <= 0}
                                className={`px-3 py-1 text-xs font-medium rounded-md
                                  ${
                                    item.stok - item.dipinjam <= 0
                                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                      : 'bg-blue-600 text-white hover:bg-blue-700'
                                  }`}
                              >
                                Pinjam
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="py-4 px-4 text-center text-sm text-gray-500">
                            Tidak ada barang tersedia di lab ini
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">Silakan pilih lab terlebih dahulu</div>
              )}
            </div>

            {selectedBarang && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Pinjam: {selectedBarang.nama_barang}</h3>
                  <button onClick={() => setSelectedBarang(null)} className="text-gray-400 hover:text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handlePinjam} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jumlah (Tersedia: {selectedBarang.stok - selectedBarang.dipinjam})
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={jumlah}
                      onChange={(e) => setJumlah(Number(e.target.value))}
                      min="1"
                      max={selectedBarang.stok - selectedBarang.dipinjam}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pinjam</label>
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={tanggalPinjam}
                      onChange={(e) => setTanggalPinjam(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      {isLoading ? 'Memproses...' : 'Pinjam Sekarang'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedBarang(null)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}

        {activeTab === 'riwayat' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Riwayat Peminjaman</h2>
            
            {isLoading ? (
              <div className="flex justify-center my-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barang</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Pinjam</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {peminjaman.length > 0 ? (
                      peminjaman.map((item) => (
                        <tr key={item.id_peminjaman}>
                          <td className="py-3 px-4 text-sm text-gray-900">{item.id_peminjaman}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">{item.nama_barang}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">{item.jumlah}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">
                            {new Date(item.tanggal_pinjam).toLocaleDateString('id-ID')}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusClass(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-4 px-4 text-center text-sm text-gray-500">
                          Belum ada riwayat peminjaman
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MahasiswaPage;