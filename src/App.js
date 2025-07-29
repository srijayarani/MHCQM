 import React, { useState } from 'react';
import './App.css';
import LoginPage from './loginPage';
 


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [uhid, setUhid] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() && uhid.trim()) {
      setIsLoggedIn(true);
    }
  };

  const patientLevels = [
    { emoji: '🩺', service: 'ECG', room: '101', duration: '10 min', uhid: '1001', name: 'Priya Sharma' },
    { emoji: '💊', service: 'ECHO', room: '102', duration: '15 min', uhid: '1002', name: 'Riyas' },
    { emoji: '🧬', service: 'SCAN', room: '103', duration: '20 min', uhid: '1003', name: 'Shusmitha' },
    { emoji: '🧪', service: 'MRI', room: '104', duration: '30 min', uhid: '1004', name: 'Potter' },
    { emoji: '❤️', service: 'TMT', room: '105', duration: '15 min', uhid: '1005', name: 'Ron' },
    { emoji: '🧠', service: 'LFT', room: '106', duration: '10 min', uhid: '1006', name: 'Hagrid' },
    { emoji: '🩻', service: 'LIPID', room: '107', duration: '10 min', uhid: '1007', name: 'Lily' },
    { emoji: '💉', service: 'CBC', room: '108', duration: '12 min', uhid: '1008', name: 'Snape' },
    { emoji: '🧫', service: 'LFT', room: '109', duration: '10 min', uhid: '1009', name: 'Hermione' },
    { emoji: '👩‍⚕️', service: 'CONSULT', room: '110', duration: '20 min', uhid: '1010', name: 'MacGonagall' },
  ];

  const [unlockedLevel, setUnlockedLevel] = useState(0);
  const [current, setCurrent] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [selected, setSelected] = useState(null);

  const handleStart = (i) => {
    if (i > unlockedLevel || completed.includes(i)) return;
    setCurrent(i);
    setTimeout(() => {
      setCompleted((prev) => [...prev, i]);
      setUnlockedLevel((prev) => prev + 1);
      setCurrent(null);
    }, 1000);
  };

  const getStatus = (i) => {
    if (completed.includes(i)) return 'Completed';
    if (current === i) return 'In Progress';
    if (i === unlockedLevel) return 'Start';
    if (i === unlockedLevel + 1) return 'In Queue';
    return 'Locked';
  };

  if (!isLoggedIn) {
    return (
      <div className="login-screen">
        <h2 className="login-title">♡ Welcome to Health Journey ♡</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter your UHID"
            value={uhid}
            onChange={(e) => setUhid(e.target.value)}
            required
          />
          <button type="submit">Start Journey</button>
        </form>
      </div>
    );
  }

  return (
    <div className="app">
      <h1 className="title">♡ Health Journey ♡</h1>
      <div className="map">
    <svg className="path" viewBox="0 0 100 1200" preserveAspectRatio="none">
          <path
            d="M50,0 Q80,100 50,200 Q20,300 50,400 Q80,500 50,600 Q20,700 50,800 Q80,900 50,1000 Q20,1100 50,1200"
            stroke="#9b0f16ff"
            strokeWidth="4"
            fill="none"
            strokeDasharray="10,10"
          />
        </svg>


        {patientLevels.map((lvl, i) => {
          const status = getStatus(i);
          const isUnlocked = i <= unlockedLevel;

          return (
            <div key={i} className={`level ${i % 2 === 0 ? 'level-left' : 'level-right'}`}>
              <div
                className={`circle ${!isUnlocked ? 'locked' : ''}`}
                onClick={() => isUnlocked && setSelected({ ...lvl, status })}
              >
                {completed.includes(i) ? '✅' : lvl.emoji}
                <div className="label">{lvl.service}</div>
                {status !== 'Locked' && (
                  <button
                    className={`status-btn ${status.toLowerCase().replace(' ', '-')}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (status === 'Start') handleStart(i);
                    }}
                    disabled={status !== 'Start'}
                  >
                    {status}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="popup">
          <div className="popup-box">
            <h2>👤 Patient Details</h2>
            <p><strong>🆔 UHID:</strong> {selected.uhid}</p>
            <p><strong>👤 Name:</strong> {selected.name}</p>
            <p><strong>🧪 Service:</strong> {selected.service}</p>
            <p><strong>🔘 Status:</strong> {selected.status}</p>
            <p><strong>🏥 Room:</strong> {selected.room}</p>
            <p><strong>⏱️ Duration:</strong> {selected.duration}</p>
            <button onClick={() => setSelected(null)} className="close-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
