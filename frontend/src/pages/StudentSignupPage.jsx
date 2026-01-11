import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAppContext } from '../context/AppContext';

export default function StudentSignupPage() {
  const navigate = useNavigate();
  const { resetSession } = useAppContext();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [studentId, setStudentId] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setStudentId('');

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password.trim(),
      confirmPassword: form.confirmPassword.trim(),
    };

    if (!payload.firstName || !payload.lastName || !payload.email || !payload.password || !payload.confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (payload.password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    if (payload.password !== payload.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { student } = await api.registerStudent(payload);
      resetSession();
      setStudentId(student.studentId);
      setSuccess('Account created successfully. Use the ID below when prompted.');
      setForm({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '520px', width: '100%' }}>
        <h1 style={{ marginTop: 0 }}>Create Student Account</h1>
        <p style={{ color: '#475569', marginBottom: '1.75rem' }}>
          Fill in your details to receive a unique 5-digit student ID. You will use this along with your email to manage
          registrations.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="firstName">First name</label>
            <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Jane" />
          </div>
          <div className="form-control">
            <label htmlFor="lastName">Last name</label>
            <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" />
          </div>
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
              placeholder="Create a password"
            />
          </div>
          <div className="form-control">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter the password"
            />
          </div>

          {error && <div className="error">{error}</div>}
          {success && (
            <div className="success" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span>{success}</span>
              {studentId && (
                <span>
                  <strong>Your Student ID:</strong> {studentId}
                </span>
              )}
            </div>
          )}

          <button type="submit" className="button primary" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', color: '#475569' }}>
          Already registered? <Link to="/student/login">Log in as a student</Link>
        </p>
        <p style={{ textAlign: 'center', color: '#475569' }}>
          Are you the admin? <Link to="/admin/login">Go to admin login</Link>
        </p>
      </div>
    </div>
  );
}
