import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import AdminPage from './pages/Admin/AdminPage.jsx';
import MahasiswaPage from './pages/Mahasiswa/MahasiswaPage.jsx';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Routes>
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
      <Route path="/" element={<Navigate to="/register" />} />
    </Routes>
  );
}

export default App;