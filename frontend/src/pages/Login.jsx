import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:3000/api/login`, {
        username,
        password,
      });
      localStorage.setItem('token', res.data.token);
      if (res.data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/mahasiswa');
      }
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.message || 'Server error'));
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      <p>
        Belum punya akun? <a href="/register">Register</a>
      </p>
    </div>
  );
}

export default Login;