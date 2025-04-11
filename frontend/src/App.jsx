import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import AdminPage from './pages/Admin/AdminPage.jsx';
import MahasiswaPage from './pages/Mahasiswa/MahasiswaPage.jsx';
import KelolaBarang from './pages/Admin/KelolaBarang.jsx';
import KelolaLab from './pages/Admin/KelolaLab.jsx';
import Peminjam from './pages/Admin/Peminjam.jsx';
import PrivateRoutes from './PrivateRoutes.jsx';

function App() {
  return (
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Private Routes */}
        <Route element={<PrivateRoutes />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/mahasiswa" element={<MahasiswaPage />} />
          <Route path="/admin/barang" element={<KelolaBarang />} />
          <Route path="/admin/lab" element={<KelolaLab />} />
          <Route path="/admin/peminjam" element={<Peminjam />} />
        </Route>

        {/* Redirect to Landing Page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  );
}

export default App;