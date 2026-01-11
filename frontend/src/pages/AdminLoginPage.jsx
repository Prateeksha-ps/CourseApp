import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAppContext } from '../context/AppContext';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { resetSession, setAdmin, setCourses } = useAppContext();
  const [form, setForm] = useState({ username: 'admin', password: 'admin' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.username.trim() || !form.password.trim()) {
      setError('Username and password are required.');
      return;
    }

    setLoading(true);
    try {
      const { admin } = await api.loginAdmin({
        username: form.username.trim(),
        password: form.password.trim(),
      });

      resetSession();
      setAdmin(admin);

      const coursesData = await api.getAdminCourses();
      setCourses(coursesData);

      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '420px', width: '100%' }}>
        <h1 style={{ marginTop: 0 }}>Admin Login</h1>
        <p style={{ color: '#475569', marginBottom: '1.75rem' }}>
          Use the administrator credentials to manage courses and review registrations.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="admin"
              autoComplete="username"
            />
          </div>
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="admin"
              autoComplete="current-password"
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="button primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
            {loading ? 'Signing in…' : 'Log in as admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
