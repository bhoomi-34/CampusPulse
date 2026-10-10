import { useEffect, useState } from 'react';
import API from '../../api/axios';

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/attendance/my')
      .then(res => setAttendance(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getBadge = (percentage) => {
    if (percentage >= 75) return { color: '#22c55e', label: 'Good' };
    if (percentage >= 65) return { color: '#f59e0b', label: 'Warning' };
    return { color: '#ef4444', label: 'Low' };
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📋 Attendance Tracker</h2>
      {loading ? (
        <p style={styles.empty}>Loading...</p>
      ) : attendance.length === 0 ? (
        <p style={styles.empty}>No attendance records found yet.</p>
      ) : (
        <div style={styles.grid}>
          {attendance.map((item, i) => {
            const badge = getBadge(item.percentage);
            return (
              <div key={i} style={{ ...styles.card, borderLeft: `4px solid ${badge.color}` }}>
                <h3 style={styles.subject}>{item.subject}</h3>
                <div style={styles.row}>
                  <span style={styles.label}>Present</span>
                  <span style={styles.value}>{item.present} / {item.total}</span>
                </div>
                <div style={styles.barBg}>
                  <div style={{
                    ...styles.barFill,
                    width: `${item.percentage}%`,
                    background: badge.color
                  }} />
                </div>
                <div style={styles.footer}>
                  <span style={{ ...styles.badge, background: badge.color }}>
                    {badge.label}
                  </span>
                  <span style={styles.percent}>{item.percentage}%</span>
                </div>
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' },
  card: { background: '#1e293b', padding: '1.5rem', borderRadius: '12px' },
  subject: { color: '#f1f5f9', marginBottom: '1rem', fontSize: '1rem' },
  row: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' },
  label: { color: '#94a3b8', fontSize: '0.85rem' },
  value: { color: '#cbd5e1', fontSize: '0.85rem' },
  barBg: { background: '#334155', borderRadius: '99px', height: '8px', marginBottom: '0.75rem' },
  barFill: { height: '8px', borderRadius: '99px', transition: 'width 0.5s ease' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  badge: { padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', color: '#fff', fontWeight: 'bold' },
  percent: { color: '#f1f5f9', fontWeight: 'bold', fontSize: '1.1rem' }
};