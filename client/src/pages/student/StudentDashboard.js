import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Attendance from './Attendance';
import Assignments from './Assignments';
import Events from './Events';
import Complaints from './Complaints';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('Dashboard');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderPage = () => {
    if (activePage === 'Attendance') return <Attendance />;
    if (activePage === 'Assignments') return <Assignments />;
    if (activePage === 'Events') return <Events />;
    if (activePage === 'Complaints') return <Complaints />;
    return (
      <>
        <h1 style={styles.heading}>Welcome back, {user?.name}! 🎓</h1>
        <div style={styles.grid}>
          {[
            { icon: '📋', label: 'Attendance' },
            { icon: '📝', label: 'Assignments' },
            { icon: '🎉', label: 'Events' },
            { icon: '📢', label: 'Complaints' },
            { icon: '📌', label: 'Notices' },
            { icon: '💼', label: 'Portfolio' },
          ].map((item, i) => (
            <div key={i} style={styles.card} onClick={() => setActivePage(item.label)}>
              <h3>{item.icon} {item.label}</h3>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>CampusPulse</h2>
        <p style={styles.welcome}>👋 {user?.name}</p>
        <nav>
          {['Dashboard', 'Attendance', 'Assignments', 'Events', 'Complaints', 'Notices', 'Doubts', 'Portfolio'].map(item => (
            <div
              key={item}
              onClick={() => setActivePage(item)}
              style={{
                ...styles.navItem,
                background: activePage === item ? '#334155' : 'transparent',
                color: activePage === item ? '#6366f1' : '#cbd5e1'
              }}
            >
              {item}
            </div>
          ))}
        </nav>
        <button onClick={handleLogout} style={styles.logout}>Logout</button>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {renderPage()}
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', background: '#0f172a', color: '#fff' },
  sidebar: { width: '240px', background: '#1e293b', padding: '1.5rem', display: 'flex', flexDirection: 'column' },
  logo: { color: '#6366f1', fontSize: '1.4rem', marginBottom: '0.5rem' },
  welcome: { color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' },
  navItem: { padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '0.3rem', cursor: 'pointer', transition: 'all 0.2s' },
  logout: { marginTop: 'auto', padding: '0.75rem', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  main: { flex: 1, padding: '2rem' },
  heading: { fontSize: '1.8rem', marginBottom: '2rem', color: '#f1f5f9' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' },
  card: { background: '#1e293b', padding: '1.5rem', borderRadius: '12px', cursor: 'pointer', borderLeft: '4px solid #6366f1' },
};