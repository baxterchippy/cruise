import React, { useState } from 'react';
import './App.css';
import { db } from './firebase';
import { collection, addDoc, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const STOPS = [
  'Boston',
  'Portland, Maine',
  'Saint John, NB',
  'Halifax',
  'Sydney, Canada',
];

const USERS = {
  'abby': 'abby',
  'greg': 'greg',
  'molly': 'molly',
  'kasia': 'kasia'
};

function Modal({ open, onClose, onSubmit, type, stops }) {
  const [selectedStop, setSelectedStop] = useState(stops[0]);
  const [input, setInput] = useState('');

  React.useEffect(() => {
    if (open) {
      setSelectedStop(stops[0]);
      setInput('');
    }
  }, [open, stops]);

  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(30, 32, 40, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#f8fafc', color: '#222', padding: 32, borderRadius: 16, minWidth: 340, boxShadow: '0 8px 32px rgba(0,0,0,0.25)', border: '1.5px solid #e0e7ef',
        display: 'flex', flexDirection: 'column', gap: 18
      }}>
        <h2 style={{ margin: 0, fontWeight: 700, fontSize: 24, color: '#1e293b' }}>Add {type === 'eat' ? 'Place to Eat' : 'Place to Sightsee'}</h2>
        <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#334155', gap: 6 }}>
          Stop:
          <select
            value={selectedStop}
            onChange={e => setSelectedStop(e.target.value)}
            style={{
              padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 16, background: '#fff', color: '#222', outline: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)', marginTop: 2
            }}
          >
            {stops.map(stop => <option key={stop} value={stop}>{stop}</option>)}
          </select>
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#334155', gap: 6 }}>
          Name:
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{
              padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 16, background: '#fff', color: '#222', outline: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)', marginTop: 2
            }}
            placeholder={type === 'eat' ? 'Restaurant name...' : 'Attraction name...'}
            autoFocus
          />
        </label>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <button
            onClick={onClose}
            style={{ background: '#e2e8f0', color: '#334155', border: 'none', padding: '9px 20px', borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: 'pointer', transition: 'background 0.2s' }}
          >Cancel</button>
          <button
            onClick={() => { if (input.trim()) { onSubmit(selectedStop, input.trim()); }}}
            style={{ background: '#61dafb', color: '#1e293b', border: 'none', padding: '9px 20px', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: input.trim() ? 'pointer' : 'not-allowed', opacity: input.trim() ? 1 : 0.6, transition: 'background 0.2s' }}
            disabled={!input.trim()}
          >Add</button>
        </div>
      </div>
    </div>
  );
}

function EditModal({ open, onClose, place, onSave, onDelete }) {
  const [selectedStop, setSelectedStop] = useState('');
  const [input, setInput] = useState('');

  React.useEffect(() => {
    if (open && place) {
      setSelectedStop(place.stop);
      setInput(place.value);
    }
  }, [open, place]);

  if (!open) return null;

  const handleSave = () => {
    if (input.trim()) {
      onSave(place.id, selectedStop, input.trim());
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this place?')) {
      onDelete(place.id);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(30, 32, 40, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#f8fafc', color: '#222', padding: 32, borderRadius: 16, minWidth: 340, boxShadow: '0 8px 32px rgba(0,0,0,0.25)', border: '1.5px solid #e0e7ef',
        display: 'flex', flexDirection: 'column', gap: 18
      }}>
        <h2 style={{ margin: 0, fontWeight: 700, fontSize: 24, color: '#1e293b' }}>Edit {place?.type === 'eat' ? 'Food Place' : 'Sightseeing Place'}</h2>
        <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#334155', gap: 6 }}>
          Stop:
          <select
            value={selectedStop}
            onChange={e => setSelectedStop(e.target.value)}
            style={{
              padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 16, background: '#fff', color: '#222', outline: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)', marginTop: 2
            }}
          >
            {STOPS.map(stop => <option key={stop} value={stop}>{stop}</option>)}
          </select>
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#334155', gap: 6 }}>
          Name:
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{
              padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 16, background: '#fff', color: '#222', outline: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)', marginTop: 2
            }}
            placeholder={place?.type === 'eat' ? 'Restaurant name...' : 'Attraction name...'}
            autoFocus
          />
        </label>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
          <button
            onClick={handleDelete}
            style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
          >Delete</button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={onClose}
              style={{ background: '#e2e8f0', color: '#334155', border: 'none', padding: '9px 20px', borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
            >Cancel</button>
            <button
              onClick={handleSave}
              style={{ background: '#61dafb', color: '#1e293b', border: 'none', padding: '9px 20px', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: input.trim() ? 'pointer' : 'not-allowed', opacity: input.trim() ? 1 : 0.6 }}
              disabled={!input.trim()}
            >Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginModal({ open, onClose, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (open) {
      setUsername('');
      setPassword('');
      setError('');
    }
  }, [open]);

  if (!open) return null;

  const handleLogin = () => {
    if (USERS[username] && USERS[username] === password) {
      onLogin(username);
      onClose();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(30, 32, 40, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#f8fafc', color: '#222', padding: 32, borderRadius: 16, minWidth: 340, boxShadow: '0 8px 32px rgba(0,0,0,0.25)', border: '1.5px solid #e0e7ef',
        display: 'flex', flexDirection: 'column', gap: 18
      }}>
        <h2 style={{ margin: 0, fontWeight: 700, fontSize: 24, color: '#1e293b' }}>Login Required</h2>
        <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>Please login to add places</p>
        {error && <p style={{ margin: 0, color: '#dc2626', fontSize: 14 }}>{error}</p>}
        <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#334155', gap: 6 }}>
          Username:
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{
              padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 16, background: '#fff', color: '#222', outline: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)', marginTop: 2
            }}
            placeholder="Enter username"
            autoFocus
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', fontWeight: 500, color: '#334155', gap: 6 }}>
          Password:
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              padding: '8px 10px', borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 16, background: '#fff', color: '#222', outline: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)', marginTop: 2
            }}
            placeholder="Enter password"
            onKeyPress={e => e.key === 'Enter' && handleLogin()}
          />
        </label>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <button
            onClick={onClose}
            style={{ background: '#e2e8f0', color: '#334155', border: 'none', padding: '9px 20px', borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
          >Cancel</button>
          <button
            onClick={handleLogin}
            style={{ background: '#61dafb', color: '#1e293b', border: 'none', padding: '9px 20px', borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
          >Login</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  // State: { [stop]: { eat: [], visit: [] } }
  const [plans, setPlans] = useState(
    STOPS.reduce((acc, stop) => {
      acc[stop] = { eat: [], visit: [] };
      return acc;
    }, {})
  );
  const [inputs, setInputs] = useState(
    STOPS.reduce((acc, stop) => {
      acc[stop] = { eat: '', visit: '' };
      return acc;
    }, {})
  );
  const [modal, setModal] = useState({ open: false, type: null });
  const [editModal, setEditModal] = useState({ open: false, place: null });
  const [loginModal, setLoginModal] = useState({ open: false, action: null });
  const [currentUser, setCurrentUser] = useState(null);
  const [foodPlacesExpanded, setFoodPlacesExpanded] = useState(false);
  const [sightseeingExpanded, setSightseeingExpanded] = useState(false);
  const [foodPlaces, setFoodPlaces] = useState([]);
  const [sightseeingPlaces, setSightseeingPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sightseeingLoading, setSightseeingLoading] = useState(true);

  React.useEffect(() => {
    // Listen for real-time updates to 'eat' places
    const q = query(collection(db, 'places'), where('type', '==', 'eat'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFoodPlaces(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    // Listen for real-time updates to 'visit' places
    const q = query(collection(db, 'places'), where('type', '==', 'visit'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSightseeingPlaces(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setSightseeingLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (stop, type, value) => {
    setInputs({
      ...inputs,
      [stop]: { ...inputs[stop], [type]: value },
    });
  };

  const handleAdd = (stop, type) => {
    const value = inputs[stop][type].trim();
    if (!value) return;
    setPlans({
      ...plans,
      [stop]: {
        ...plans[stop],
        [type]: [...plans[stop][type], value],
      },
    });
    setInputs({
      ...inputs,
      [stop]: { ...inputs[stop], [type]: '' },
    });
  };

  const handleModalAdd = async (stop, value, type) => {
    setPlans({
      ...plans,
      [stop]: {
        ...plans[stop],
        [type]: [...plans[stop][type], value],
      },
    });
    setModal({ open: false, type: null });
    // Store in Firestore
    try {
      await addDoc(collection(db, 'places'), {
        stop,
        value,
        type,
        timestamp: new Date()
      });
    } catch (e) {
      console.error('Error adding document to Firestore:', e);
    }
  };

  const handleEditPlace = (place) => {
    setEditModal({ open: true, place });
  };

  const handleSaveEdit = async (id, stop, value) => {
    try {
      await updateDoc(doc(db, 'places', id), {
        stop,
        value,
        timestamp: new Date()
      });
      setEditModal({ open: false, place: null });
    } catch (e) {
      console.error('Error updating document:', e);
    }
  };

  const handleDeletePlace = async (id) => {
    try {
      await deleteDoc(doc(db, 'places', id));
      setEditModal({ open: false, place: null });
    } catch (e) {
      console.error('Error deleting document:', e);
    }
  };

  const handleAddClick = (type) => {
    if (currentUser) {
      setModal({ open: true, type });
    } else {
      setLoginModal({ open: true, action: type });
    }
  };

  const handleLogin = (username) => {
    setCurrentUser(username);
    if (loginModal.action) {
      setModal({ open: true, type: loginModal.action });
      setLoginModal({ open: false, action: null });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="App">
      {/* Family member images in corners */}
      <img src={`${process.env.PUBLIC_URL}/family1.jpg`} alt="Family member 1" className="family-corner" style={{ position: 'fixed', top: 18, left: 18, width: 90, height: 90, borderRadius: '50%', border: '4px solid #fff', boxShadow: '0 2px 12px rgba(0,0,0,0.18)', objectFit: 'cover', zIndex: 2000 }} />
      <img src={`${process.env.PUBLIC_URL}/family2.jpg`} alt="Family member 2" className="family-corner" style={{ position: 'fixed', top: 18, right: 18, width: 90, height: 90, borderRadius: '50%', border: '4px solid #fff', boxShadow: '0 2px 12px rgba(0,0,0,0.18)', objectFit: 'cover', zIndex: 2000 }} />
      <img src={`${process.env.PUBLIC_URL}/family3.jpg`} alt="Family member 3" className="family-corner" style={{ position: 'fixed', bottom: 18, left: 18, width: 90, height: 90, borderRadius: '50%', border: '4px solid #fff', boxShadow: '0 2px 12px rgba(0,0,0,0.18)', objectFit: 'cover', zIndex: 2000 }} />
      <img src={`${process.env.PUBLIC_URL}/family4.jpg`} alt="Family member 4" className="family-corner" style={{ position: 'fixed', bottom: 18, right: 18, width: 90, height: 90, borderRadius: '50%', border: '4px solid #fff', boxShadow: '0 2px 12px rgba(0,0,0,0.18)', objectFit: 'cover', zIndex: 2000 }} />
      <header className="App-header">
        <div className="center-content">
          <img
            src={`${process.env.PUBLIC_URL}/princess_cruise.jpg`}
            alt="Princess Cruises ship in cold weather"
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '16px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
              marginBottom: '1.5em',
              border: '4px solid #61dafb',
            }}
          />
          <div className="button-container" style={{ marginBottom: 16, display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => handleAddClick('eat')} style={{ background: '#61dafb', color: '#222', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 600, fontSize: 16 }}>Add Place to Eat</button>
            <button onClick={() => handleAddClick('visit')} style={{ background: '#61dafb', color: '#222', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 600, fontSize: 16 }}>Add Place to Sightsee</button>
            {currentUser && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 16 }}>
                <span style={{ fontSize: 14, color: '#64748b' }}>Logged in as: <strong>{currentUser}</strong></span>
                <button onClick={handleLogout} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, fontWeight: 600, fontSize: 12 }}>Logout</button>
              </div>
            )}
          </div>
          <h1 style={{ margin: '0 0 10px 0', fontSize: 40 }}>New England Cruise</h1>
          <p style={{ margin: '0 0 6px 0', fontSize: 20 }}><b>Dates:</b> August 2 – August 9</p>
          <p style={{ margin: '0 0 20px 0', fontSize: 18 }}><b>Stops:</b> {STOPS.join(', ')}</p>
          
          {/* Accordion Section */}
          <div className="accordion-container">
            <div className="accordion-item">
              <h3 
                onClick={() => setFoodPlacesExpanded(!foodPlacesExpanded)}
                className="accordion-header"
              >
                Food Places ({foodPlaces.length})
                <span style={{ fontSize: 14 }}>{foodPlacesExpanded ? '▲' : '▼'}</span>
              </h3>
              {foodPlacesExpanded && (
                <div className="accordion-content">
                  {loading ? (
                    <p style={{ color: '#64748b', fontSize: 14, fontStyle: 'italic', margin: 0 }}>Loading food places...</p>
                  ) : foodPlaces.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {foodPlaces.map(place => (
                        <div key={place.id} className="place-item">
                          <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: 4, fontSize: 15 }}>{place.value}</div>
                          <div style={{ fontSize: 13, color: '#64748b' }}>{place.stop}</div>
                          <button 
                            onClick={() => handleEditPlace(place)}
                            className="edit-button"
                            title="Edit"
                          >✏️</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#64748b', fontSize: 14, fontStyle: 'italic', margin: 0 }}>No food places added yet</p>
                  )}
                </div>
              )}
            </div>
            
            <div className="accordion-item">
              <h3 
                onClick={() => setSightseeingExpanded(!sightseeingExpanded)}
                className="accordion-header"
              >
                Places to See ({sightseeingPlaces.length})
                <span style={{ fontSize: 14 }}>{sightseeingExpanded ? '▲' : '▼'}</span>
              </h3>
              {sightseeingExpanded && (
                <div className="accordion-content">
                  {sightseeingLoading ? (
                    <p style={{ color: '#64748b', fontSize: 14, fontStyle: 'italic', margin: 0 }}>Loading places to see...</p>
                  ) : sightseeingPlaces.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {sightseeingPlaces.map(place => (
                        <div key={place.id} className="place-item">
                          <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: 4, fontSize: 15 }}>{place.value}</div>
                          <div style={{ fontSize: 13, color: '#64748b' }}>{place.stop}</div>
                          <button 
                            onClick={() => handleEditPlace(place)}
                            className="edit-button"
                            title="Edit"
                          >✏️</button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#64748b', fontSize: 14, fontStyle: 'italic', margin: 0 }}>No places to see added yet</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, type: null })}
        onSubmit={(stop, value) => handleModalAdd(stop, value, modal.type)}
        type={modal.type}
        stops={STOPS}
      />
      <EditModal
        open={editModal.open}
        onClose={() => setEditModal({ open: false, place: null })}
        place={editModal.place}
        onSave={handleSaveEdit}
        onDelete={handleDeletePlace}
      />
      <LoginModal
        open={loginModal.open}
        onClose={() => setLoginModal({ open: false, action: null })}
        onLogin={handleLogin}
      />
      {/* Remove the main section with stops and lists */}
    </div>
  );
}

export default App;
