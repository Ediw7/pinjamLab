import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('mahasiswa');
  const [nama, setNama] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:3000/api/register`, {
        username,
        password,
        role,
        nama,
      });
      alert(`Register successful! ID: ${res.data.id}`);
      navigate('/login');
    } catch (err) {
      alert('Register failed: ' + (err.response?.data?.message || 'Server error'));
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="mahasiswa">Mahasiswa</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="text"
          placeholder="Nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
      <p>
        Sudah punya akun? <a href="/login">Login</a>
      </p>
    </div>
  );
}

export default Register;