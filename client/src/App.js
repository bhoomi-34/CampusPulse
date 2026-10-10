import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/student/StudentDashboard';

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/student/*" element={
            <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/faculty/*" element={
            <ProtectedRoute role="faculty"><div style={{color:'white',padding:'2rem'}}>Faculty Dashboard — Coming Next</div></ProtectedRoute>
          } />
          <Route path="/admin/*" element={
            <ProtectedRoute role="admin"><div style={{color:'white',padding:'2rem'}}>Admin Dashboard — Coming Next</div></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;