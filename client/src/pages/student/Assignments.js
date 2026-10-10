import { useEffect, useState } from 'react';
import API from '../../api/axios';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/assignments')
      .then(res => setAssignments(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'submitted': return { color: '#22c55e', label: '✅ Submitted' };
      case 'overdue':   return { color: '#ef4444', label: '🔴 Overdue' };
      case 'due_soon':  return { color: '#f59e0b', label: '⚠️ Due Soon' };
      default:          return { color: '#6366f1', label: '📝 Pending' };
    }
  };

  const handleSubmit = async (id) => {
    try {
      await API.put(`/assignments/submit/${id}`);
      setAssignments(prev =>
        prev.map(a => a.id === id ? { ...a, status: 'submitted' } : a)
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📝 Assignments</h2>
      {loading ? (
        <p style={styles.empty}>Loading...</p>
      ) : assignments.length === 0 ? (
        <p style={styles.empty}>No assignments found yet.</p>
      ) : (
        <div style={styles.list}>
          {assignments.map((a, i) => {
            const s = getStatusStyle(a.status);
            return (
              <div key={i} style={{ ...styles.card, borderLeft: `4px solid ${s.color}` }}>
                <div style={styles.top}>
                  <h3 style={styles.title}>{a.title}</h3>
                  <span style={{ ...styles.badge, background: s.color }}>{s.label}</span>
                </div>
                <p style={styles.subject}>📚 {a.Subject?.name} &nbsp;|&nbsp; 👨‍🏫 {a.Faculty?.name}</p>
                <p style={styles.desc}>{a.description}</p>
                <div style={styles.bottom}>
                  <span style={styles.deadline}>
                    🕐 Deadline: {new Date(a.deadline).toLocaleString()}
                  </span>
                  {a.status !== 'submitted' && (
                    <button
                      style={styles.btn}
                      onClick={() => handleSubmit(a.id)}
                    >
                      Mark as Submitted
                    </button>
                  )}
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
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { background: '#1e293b', padding: '1.5rem', borderRadius: '12px' },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  title: { color: '#f1f5f9', fontSize: '1rem', margin: 0 },
  badge: { padding: '0.2rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', color: '#fff', fontWeight: 'bold' },
  subject: { color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.5rem' },
  desc: { color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '1rem' },
  bottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  deadline: { color: '#94a3b8', fontSize: '0.85rem' },
  btn: { padding: '0.4rem 1rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }
};