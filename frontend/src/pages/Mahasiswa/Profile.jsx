// src/pages/Profile.jsx
import React from 'react';

function Profile() {
  const user = JSON.parse(localStorage.getItem('user')); // atau dari context/state

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Profil Pengguna</h1>
      <p><strong>Nama:</strong> {user?.nama || 'Tidak diketahui'}</p>
      <p><strong>Email:</strong> {user?.email || 'Tidak diketahui'}</p>
    </div>
  );
}

export default Profile;
