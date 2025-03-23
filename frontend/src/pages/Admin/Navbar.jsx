function Navbar() {
    return (
      <div style={{
        height: '60px',
        backgroundColor: '#34495e',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        position: 'fixed',
        top: 0,
        left: '200px',
        right: 0,
      }}>
        <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
      </div>
    );
  }
  
  export default Navbar;