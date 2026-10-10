import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../api/axios';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', srn: '', phone: '', year: '', semester: '',
    department: 'CSE', role: 'student', password: ''
  });
  const [error, setError] = useState('');

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    try {
      await API.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>CampusPulse</h2>
        <p style={styles.sub}>Create your account</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={submit}>
          <input style={styles.input} name="name" placeholder="Full Name" onChange={handle} required />
          <input style={styles.input} name="srn" placeholder="SRN (e.g. srn@snpsu.edu.in)" onChange={handle} required />
          <input style={styles.input} name="phone" placeholder="Phone" onChange={handle} />
          <input style={styles.input} name="year" placeholder="Year" type="number" onChange={handle} />
          <input style={styles.input} name="semester" placeholder="Semester" type="number" onChange={handle} />
          <select style={styles.input} name="department" onChange={handle}>
            <option value="CSE">CSE</option>
            <option value="AIML">AIML</option>
            <option value="AIDS">AIDS</option>
          </select>
          <select style={styles.input} name="role" onChange={handle}>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>
          <input style={styles.input} name="password" placeholder="Password" type="password" onChange={handle} required />
          <button style={styles.button} type="submit">Register</button>
        </form>
        <p style={styles.link}>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' },
  card: { background: '#1e293b', padding: '2rem', borderRadius: '12px', width: '380px', color: '#fff' },
  title: { textAlign: 'center', fontSize: '1.8rem', color: '#6366f1', marginBottom: '0.2rem' },
  sub: { textAlign: 'center', color: '#94a3b8', marginBottom: '1.5rem' },
  input: { width: '100%', padding: '0.6rem', marginBottom: '0.8rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', boxSizing: 'border-box' },
  button: { width: '100%', padding: '0.75rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  error: { color: '#f87171', marginBottom: '1rem', textAlign: 'center' },
  link: { textAlign: 'center', marginTop: '1rem', color: '#94a3b8', fontSize: '0.9rem' }
};