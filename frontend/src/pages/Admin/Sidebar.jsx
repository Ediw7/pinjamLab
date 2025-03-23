import { useNavigate } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{
      width: '200px',
      height: '100vh',
      backgroundColor: '#2c3e50',
      color: 'white',
      position: 'fixed',
      top: 0,
      left: 0,
      padding: '20px',
    }}>
      <h2 style={{ margin: '0 0 20px 0' }}>Admin Menu</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ margin: '10px 0' }}>
          <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</a>
        </li>
        <li style={{ margin: '10px 0' }}>
          <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Kelola Barang</a>
        </li>
        <li style={{ margin: '10px 0' }}>
          <a href="#" style={{ color: 'white', textDecoration: 'none' }}>Kelola Lab</a>
        </li>
        <li style={{ margin: '10px 0' }}>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: 0,
              fontSize: '16px',
            }}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;