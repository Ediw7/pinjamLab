import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ArrowRight, Beaker, ShieldCheck, Clock } from 'lucide-react';

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');

      if (!token) return;

      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/verify-token`, { token });

        if (res.data.role) {
          const role = res.data.role;
          navigate(role === 'admin' ? '/admin' : '/mahasiswa');
        }
      } catch (err) {
        console.error('Token verification failed:', err);
        localStorage.removeItem('token');
      }
    };

    verifyToken();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white z-20 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Beaker className="w-6 h-6 text-blue-600 mr-2" />
              <span className="text-xl font-semibold text-gray-900">PinjamLab</span>
            </div>
            
            {/* Desktop Menu */}
            
            
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors">Login</Link>
              <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Register</Link>
            </div>
            
            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
             
              <div className="mt-4 space-y-2">
                <Link to="/login" className="block py-2 text-gray-600 hover:text-blue-600">Login</Link>
                <Link to="/register" className="block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center">Register</Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 mb-6">
                Peminjaman Alat Lab yang Mudah dan Efisien
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                PinjamLab menyediakan solusi untuk meminjam alat laboratorium kampus dengan cepat, aman, dan terpercaya.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  to="/register"
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center inline-flex items-center justify-center"
                >
                  Mulai Sekarang <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors text-center"
                >
                  Login
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0">
              <div className="relative">
                <div className="absolute -left-4 -top-4 w-24 h-24 bg-blue-100 rounded-full"></div>
                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-blue-50 rounded-full"></div>
                <div className="relative bg-white p-4 shadow-lg rounded-lg z-10">
                  <img 
                    src="https://lh3.googleusercontent.com/gps-cs-s/AB5caB9mtUslfPBurZUAcPOxZlfRu1CCsURELDag8DQLvEkbizfNbXM45vFEF1hNt5h3lKc5Mto5Cu6X03Zn8Hgo9s48AijswbglGaLddJEN1zyPcfWF02Iklr4M3mWqOU4RcvFaCs8n=s680-w680-h510" 
                    alt="Laboratory Equipment" 
                    className="w-full h-auto rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Kenapa Memilih PinjamLab?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Clock className="text-blue-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Efisien</h3>
              <p className="text-gray-600">
                Proses peminjaman yang cepat tanpa birokrasi rumit. Hemat waktu untuk penelitian Anda.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <ShieldCheck className="text-blue-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Terpercaya</h3>
              <p className="text-gray-600">
                Sistem pelacakan yang memastikan keamanan inventaris laboratorium kampus Anda.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Beaker className="text-blue-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Lengkap</h3>
              <p className="text-gray-600">
                Akses ke berbagai peralatan laboratorium dengan sistem inventaris terperinci.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Siap untuk Mulai?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan kampus-kampus lain yang telah menggunakan PinjamLab untuk mengelola inventaris laboratorium mereka.
          </p>
          <Link 
            to="/register"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-block"
          >
            Daftar Sekarang
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <Beaker className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-semibold text-gray-900">PinjamLab</span>
              </div>
              <p className="text-gray-600 mt-2 text-sm">
                Solusi peminjaman alat laboratorium untuk kampus modern.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Perusahaan</h3>
                <ul className="space-y-2">
                  <li><Link to="/about" className="text-gray-600 hover:text-blue-600 text-sm">Tentang Kami</Link></li>
                  <li><Link to="/team" className="text-gray-600 hover:text-blue-600 text-sm">Tim</Link></li>
                  <li><Link to="/careers" className="text-gray-600 hover:text-blue-600 text-sm">Karir</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Layanan</h3>
                <ul className="space-y-2">
                  <li><Link to="/features" className="text-gray-600 hover:text-blue-600 text-sm">Fitur</Link></li>
                  <li><Link to="/pricing" className="text-gray-600 hover:text-blue-600 text-sm">Harga</Link></li>
                  <li><Link to="/faq" className="text-gray-600 hover:text-blue-600 text-sm">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Kontak</h3>
                <ul className="space-y-2">
                  <li><Link to="/contact" className="text-gray-600 hover:text-blue-600 text-sm">Hubungi Kami</Link></li>
                  <li><Link to="/support" className="text-gray-600 hover:text-blue-600 text-sm">Dukungan</Link></li>
                  <li><Link to="/partners" className="text-gray-600 hover:text-blue-600 text-sm">Partner</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6 mt-6 text-sm text-gray-500 text-center">
            &copy; 2025 PinjamLab. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;