import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAppContext } from '../context/AppContext';

export default function StudentLoginPage() {
  const navigate = useNavigate();
  const { resetSession, setStudent, setCourses, setRegistrations } = useAppContext();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.email.trim() || !form.password.trim()) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      const { student } = await api.loginStudent({
        email: form.email.trim(),
        password: form.password.trim(),
      });

      resetSession();
      setStudent(student);

      const [coursesData, registrationsData] = await Promise.all([
        api.getCourses(),
        api.getStudentRegistrations(student.studentId),
      ]);

      setCourses(coursesData);
      setRegistrations(registrationsData);

      navigate('/student/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '420px', width: '100%' }}>
        <h1 style={{ marginTop: 0 }}>Student Login</h1>
        <p style={{ color: '#475569', marginBottom: '1.75rem' }}>
          Enter your registered email and password to access the CourseTrack student dashboard.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="student@example.com"
            />
          </div>
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="button primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
            {loading ? 'Signing in…' : 'Log in'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.25rem', color: '#475569' }}>
          Need an account? <Link to="/student/signup">Create one now</Link>
        </p>
        <p style={{ textAlign: 'center', color: '#475569' }}>
          Administrator? <Link to="/admin/login">Log in as admin</Link>
        </p>
      </div>
    </div>
  );
}
