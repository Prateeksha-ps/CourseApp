import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAppContext } from '../context/AppContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser, setCourses } = useAppContext();
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Username is required.');
      return;
    }

    setLoading(true);
    try {
      const data = await api.login({ username: username.trim(), role });
      setUser(data.user);
      const courses = await api.getCourses();
      setCourses(courses);

      if (data.user.role === 'admin') {
        navigate('/courses');
      } else {
        navigate('/courses');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-wrapper">
      <div className="card" style={{ maxWidth: '420px', margin: '0 auto' }}>
        <h1 style={{ marginTop: 0 }}>CourseTrack Login</h1>
        <p style={{ color: '#475569', marginBottom: '1.5rem' }}>
          Sign in as an admin or student to manage courses and certifications.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <div className="form-control">
            <label htmlFor="role">Role</label>
            <select id="role" value={role} onChange={(event) => setRole(event.target.value)}>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="button primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Signing in…' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
