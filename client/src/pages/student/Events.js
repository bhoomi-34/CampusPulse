import { useEffect, useState } from 'react';
import API from '../../api/axios';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    API.get('/events')
      .then(res => setEvents(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getTypeStyle = (type) => {
    switch (type) {
      case 'hackathon': return { color: '#6366f1', icon: '💻' };
      case 'cultural':  return { color: '#ec4899', icon: '🎭' };
      case 'sports':    return { color: '#22c55e', icon: '🏆' };
      case 'workshop':  return { color: '#f59e0b', icon: '🛠️' };
      default:          return { color: '#94a3b8', icon: '📅' };
    }
  };

  const handleRegister = async (id) => {
    try {
      await API.post(`/events/register/${id}`);
      setMessage('✅ Registered successfully!');
      setEvents(prev => prev.map(e => {
        if (e.id === id) {
          const updated = { ...e, registered_count: e.registered_count + 1 };
          if (updated.registered_count >= updated.seat_limit) updated.is_open = false;
          return updated;
        }
        return e;
      }));
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.error || 'Registration failed'));
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🎉 Events</h2>
      {message && <div style={styles.toast}>{message}</div>}
      {loading ? (
        <p style={styles.empty}>Loading...</p>
      ) : events.length === 0 ? (
        <p style={styles.empty}>No events found yet.</p>
      ) : (
        <div style={styles.grid}>
          {events.map((e, i) => {
            const t = getTypeStyle(e.type);
            const seatsLeft = e.seat_limit - e.registered_count;
            return (
              <div key={i} style={{ ...styles.card, borderLeft: `4px solid ${t.color}` }}>
                <div style={styles.top}>
                  <span style={styles.icon}>{t.icon}</span>
                  <span style={{ ...styles.typeBadge, background: t.color }}>{e.type}</span>
                </div>
                <h3 style={styles.title}>{e.title}</h3>
                <p style={styles.date}>📅 {new Date(e.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
                <div style={styles.seats}>
                  <span style={styles.seatText}>🪑 {e.registered_count} / {e.seat_limit} registered</span>
                  <span style={{ ...styles.seatBadge, background: e.is_open ? '#22c55e' : '#ef4444' }}>
                    {e.is_open ? `${seatsLeft} seats left` : 'Full'}
                  </span>
                </div>
                <button
                  style={{ ...styles.btn, background: e.is_open ? t.color : '#334155', cursor: e.is_open ? 'pointer' : 'not-allowed' }}
                  onClick={() => e.is_open && handleRegister(e.id)}
                  disabled={!e.is_open}
                >
                  {e.is_open ? 'Register Now' : 'Event Full'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '1rem' },
  heading: { fontSize: '1.5rem', marginBottom: '1.5rem', color: '#f1f5f9' },
  empty: { color: '#94a3b8' },
  toast: { background: '#1e293b', border: '1px solid #334155', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', color: '#f1f5f9' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' },
  card: { background: '#1e293b', padding: '1.5rem', borderRadius: '12px' },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' },
  icon: { fontSize: '1.5rem' },
  typeBadge: { padding: '0.2rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', color: '#fff', fontWeight: 'bold', textTransform: 'capitalize' },
  title: { color: '#f1f5f9', fontSize: '1rem', marginBottom: '0.5rem' },
  date: { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.75rem' },
  seats: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  seatText: { color: '#94a3b8', fontSize: '0.8rem' },
  seatBadge: { padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', color: '#fff', fontWeight: 'bold' },
  btn: { width: '100%', padding: '0.6rem', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.9rem' }
};