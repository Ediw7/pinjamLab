import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MahasiswaNavbar = ({ activeTab, setActiveTab }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  
  // Get user data from localStorage (assuming it's stored there during login)
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img 
                className="h-8 w-auto" 
                src="/assets/logo-lab.png" 
                alt="Lab Logo"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/40?text=Lab";
                }}
              />
              <span className="ml-2 text-xl font-bold text-gray-800">Teknik Komputer Lab</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-2">
              <button
                onClick={() => setActiveTab('peminjaman')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'peminjaman'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                Peminjaman
              </button>
              <button
                onClick={() => setActiveTab('riwayat')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'riwayat'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                Riwayat Peminjaman
              </button>
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative">
              <div>
                <button
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  id="user-menu"
                  aria-expanded="false"
                  aria-haspopup="true"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    {userData.name ? userData.name.charAt(0).toUpperCase() : 'M'}
                  </div>
                </button>
              </div>
              
              {isProfileOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <div className="block px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                    <p className="font-medium">{userData.name || 'Mahasiswa'}</p>
                    <p className="text-xs text-gray-500">{userData.nim || ''}</p>
                  </div>
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center sm:hidden">
            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isProfileOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <button
              onClick={() => {
                setActiveTab('peminjaman');
                setIsProfileOpen(false);
              }}
              className={`w-full text-left block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                activeTab === 'peminjaman'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              }`}
            >
              Peminjaman
            </button>
            <button
              onClick={() => {
                setActiveTab('riwayat');
                setIsProfileOpen(false);
              }}
              className={`w-full text-left block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                activeTab === 'riwayat'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              }`}
            >
              Riwayat Peminjaman
            </button>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  {userData.name ? userData.name.charAt(0).toUpperCase() : 'M'}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{userData.name || 'Mahasiswa'}</div>
                <div className="text-sm font-medium text-gray-500">{userData.nim || ''}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <a
                href="/profile"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Profile
              </a>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MahasiswaNavbar;