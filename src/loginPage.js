  import React, { useState } from 'react';
import './loginPage.css';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [uhid, setUhid] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && uhid) {
      onLogin(username, uhid);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">
          ❤️  Welcome to Health Journey ❤️
        </h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="👤 Enter your Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="🆔 Enter your UHID"
            value={uhid}
            onChange={(e) => setUhid(e.target.value)}
            required
          />
          <button type="submit">🚀 Start Journey</button>
        </form>

              </div>
    </div>
  );
};

export default LoginPage;
