import { useEffect, useState } from 'react';
import API from '../../api/axios';

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: 'WiFi', description: '' });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = () => {
    API.get('/complaints')
      .then(res => setComplaints(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'resolved':    return { color: '#22c55e', label: '✅ Resolved' };
      case 'in-progress': return { color: '#f59e0b', label: '🔄 In Progress' };
      default:            return { color: '#94a3b8', label: '⏳ Pending' };
    }
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append('category', form.category);
      data.append('description', form.description);
      if (image) data.append('image', image);
      await API.post('/complaints', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('✅ Complaint submitted!');
      setShowForm(false);
      setForm({ category: 'WiFi', description: '' });
      setImage(null);
      fetchComplaints();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.error || 'Failed to submit'));
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleUpvote = async (id) => {
    try {
      const res = await API.put(`/complaints/upvote/${id}`);
      setComplaints(prev => prev.map(c =>
        c.id === id ? { ...c, upvotes: res.data.upvotes } : c
      ));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.topRow}>
        <h2 style={styles.heading}>📢 Complaints</h2>
        <button style={styles.newBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Complaint'}
        </button>
      </div>

      {message && <div style={styles.toast}>{message}</div>}

      {showForm && (
        <div style={styles.form}>
          <select
            style={styles.input}
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          >
            <option value="WiFi">WiFi</option>
            <option value="hostel">Hostel</option>
            <option value="other">Other</option>
          </select>
          <textarea
            style={{ ...styles.input, height: '100px', resize: 'none' }}
            placeholder="Describe your complaint..."
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
          <input
            type="file"
            accept="image/*"
            style={styles.fileInput}
            onChange={e => setImage(e.target.files[0])}
          />
          <button style={styles.submitBtn} onClick={handleSubmit}>Submit Complaint</button>
        </div>
      )}

      {loading ? (
        <p style={styles.empty}>Loading...</p>
      ) : complaints.length === 0 ? (
        <p style={styles.empty}>No complaints yet.</p>
      ) : (
        <div style={styles.list}>
          {complaints.map((c, i) => {
            const s = getStatusStyle(c.status);
            return (
              <div key={i} style={styles.card}>
                <div style={styles.cardTop}>
                  <div>
                    <span style={styles.category}>{c.category}</span>
                    <span style={{ ...styles.statusBadge, background: s.color }}>{s.label}</span>
                  </div>
                  <span style={styles.user}>👤 {c.User?.name || 'Anonymous'}</span>
                </div>
                <p style={styles.desc}>{c.description}</p>
                {c.image_url && (
                  <img
                    src={`http://localhost:5000${c.image_url}`}
                    alt="complaint"
                    style={styles.img}
                  />
                )}
                <div style={styles.cardBottom}>
                  <button style={styles.upvoteBtn} onClick={() => handleUpvote(c.id)}>
                    👍 {c.upvotes} Upvotes
                  </button>
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
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  heading: { fontSize: '1.5rem', color: '#f1f5f9', margin: 0 },
  newBtn: { padding: '0.5rem 1rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  toast: { background: '#1e293b', border: '1px solid #334155', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', color: '#f1f5f9' },
  form: { background: '#1e293b', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  input: { padding: '0.6rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '0.9rem' },
  fileInput: { color: '#94a3b8', fontSize: '0.85rem' },
  submitBtn: { padding: '0.6rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  empty: { color: '#94a3b8' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { background: '#1e293b', padding: '1.5rem', borderRadius: '12px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' },
  category: { background: '#334155', padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', color: '#cbd5e1', marginRight: '0.5rem' },
  statusBadge: { padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.75rem', color: '#fff', fontWeight: 'bold' },
  user: { color: '#94a3b8', fontSize: '0.85rem' },
  desc: { color: '#cbd5e1', marginBottom: '0.75rem' },
  img: { width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.75rem' },
  cardBottom: { display: 'flex', justifyContent: 'flex-end' },
  upvoteBtn: { padding: '0.4rem 1rem', background: '#334155', color: '#cbd5e1', border: 'none', borderRadius: '8px', cursor: 'pointer' }
};