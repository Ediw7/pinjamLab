import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import AdminPage from './pages/Admin/AdminPage.jsx';
import MahasiswaPage from './pages/Mahasiswa/MahasiswaPage.jsx';
import KelolaBarang from './pages/Admin/KelolaBarang.jsx';
import KelolaLab from './pages/Admin/KelolaLab.jsx';
import Peminjam from './pages/Admin/Peminjam.jsx';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Routes>
      <Route path="/landingpage" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={token ? <AdminPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/mahasiswa"
        element={token ? <MahasiswaPage /> : <Navigate to="/login" />}
      />
      <Route path="/" element={<Navigate to="/landingpage" />} />

      <Route path="/admin/barang" element={<KelolaBarang />} />
        <Route path="/admin/lab" element={<KelolaLab />} />
        <Route path="/admin/peminjam" element={<Peminjam />} />
    </Routes>
  );
}

export default App;