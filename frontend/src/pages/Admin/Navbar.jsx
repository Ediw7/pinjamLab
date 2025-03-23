import { useNavigate } from 'react-router-dom';

function Navbar({ activeTab }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white text-gray-800 flex items-center justify-between px-6 shadow-sm z-10 border-b border-gray-200">
      <div className="flex items-center space-x-8">
        <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
        <div className="flex space-x-6">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }`}
            onClick={() => navigate('/admin')}
          >
            Dashboard
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'barang'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }`}
            onClick={() => navigate('/admin/barang')}
          >
            Kelola Barang
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'lab'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }`}
            onClick={() => navigate('/admin/lab')}
          >
            Kelola Lab
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'peminjam'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }`}
            onClick={() => navigate('/admin/peminjam')}
          >
            Peminjam
          </button>
        </div>
      </div>
      <button
        className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
        onClick={handleLogout}
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;