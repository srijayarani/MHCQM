import React, { useState } from 'react';
import './App.css';
import LoginPage from './loginPage';
import { useGetPatientsQuery, useGetDepartmentsQuery, useInsertPatientMutation } from './store/apiSlice';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [uhid, setUhid] = useState('');

  // Add RTK Query hooks (placeholders for future integration)
  // const { data: patients, isLoading, isError } = useGetPatientsQuery();
  // const { data: departments } = useGetDepartmentsQuery();
  // const [updatePatientStatus, { isLoading: isUpdating }] = useUpdatePatientStatusMutation();

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

    // Placeholder for RTK Query mutation success/error handling
    // updatePatientStatus({ uhid: patientLevels[i].uhid, status: 'in-progress' })
    //   .unwrap()
    //   .then(() => { /* success */ })
    //   .catch(() => { /* error */ });

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

  const { data: patients, isLoading: isPatientsLoading, isError: isPatientsError, error: patientsError, refetch: refetchPatients } = useGetPatientsQuery();
  const { data: departments, isLoading: isDepartmentsLoading, isError: isDepartmentsError, error: departmentsError } = useGetDepartmentsQuery();
  const [insertPatient, { isLoading: isInsertLoading }] = useInsertPatientMutation();
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message: string }

  // Map service names to emojis (extend as needed)
  const getServiceEmoji = (service) => {
    const key = String(service || '').toUpperCase();
    switch (key) {
      case 'ECG': return '🩺';
      case 'ECHO': return '💊';
      case 'SCAN': return '🧬';
      case 'MRI': return '🧪';
      case 'TMT': return '❤️';
      case 'LFT': return '🧠';
      case 'LIPID': return '🩻';
      case 'CBC': return '💉';
      case 'CONSULT': return '👩‍⚕️';
      default: return '🧪';
    }
  };

  // Build dynamic levels from API; fallback to static when data unavailable
  const computedLevels = Array.isArray(patients) && patients.length > 0
    ? patients.map((p) => ({
        emoji: getServiceEmoji(p.service),
        service: p.service,
        room: p.roomNo,
        duration: `${p.duration_Min} min`,
        uhid: p.uhid,
        name: p.name
      }))
    : patientLevels; // fallback so UI still renders when API is loading/empty

  // Helper to show timed toasts
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2500);
  };

  // Use the insert API with exact payload structure per spec
  const handleInsert = async () => {
    const payload = {
      UHID: 'UH1001', // Map correctly to API spec
      Name: 'John Doe',
      Service: 'OPD',
      Status: 'Admitted',
      RoomNo: 'R101',
      Duration_Min: '30'
    };

    try {
      const res = await insertPatient(payload).unwrap();
      // Expected: { sno: number, message: string }
      showToast('success', res?.message || 'Inserted successfully');
      refetchPatients();
    } catch (e) {
      const msg = e?.data?.message || 'Failed to insert patient';
      showToast('error', msg);
    }
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
      {/* Simple toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 10, right: 10, zIndex: 9999, padding: '10px 14px', borderRadius: 8, color: '#fff', background: toast.type === 'success' ? '#2e7d32' : '#c62828', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          {toast.message}
        </div>
      )}

      <h1 className="title">♡ Health Journey ♡</h1>

      {/* Data status banners */}
      {isPatientsLoading && <div style={{ color: '#fff', marginBottom: 8 }}>Loading patients...</div>}
      {isPatientsError && (
        <div style={{ color: '#ffd2d2', marginBottom: 8 }}>Patients error: {String(patientsError?.status || '')}</div>
      )}
      {isDepartmentsLoading && <div style={{ color: '#fff', marginBottom: 8 }}>Loading departments...</div>}
      {isDepartmentsError && (
        <div style={{ color: '#ffd2d2', marginBottom: 8 }}>Departments error: {String(departmentsError?.status || '')}</div>
      )}

      {/* Optional debug list headers (remove if not needed) */}
      <div style={{ color: '#fff', marginBottom: 10 }}>
        Patients: {Array.isArray(patients) ? patients.length : 0} | Departments: {Array.isArray(departments) ? departments.length : 0}
      </div>

      {/* Add a quick insert demo button */}
      <div style={{ marginBottom: 10 }}>
        <button disabled={isInsertLoading} onClick={handleInsert} className="status-btn start">
          {isInsertLoading ? 'Inserting...' : 'Insert Sample Patient'}
        </button>
      </div>

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

        {computedLevels.map((lvl, i) => {
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
