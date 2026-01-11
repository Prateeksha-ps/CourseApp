import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { useAppContext } from '../context/AppContext';

export default function RegistrationPage() {
  const { user, selectedCourseId, courses } = useAppContext();
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [loadingAgreement, setLoadingAgreement] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const selectedCourse = useMemo(
    () => courses.find((course) => course.courseId === selectedCourseId),
    [courses, selectedCourseId]
  );

  useEffect(() => {
    if (user.role === 'student') {
      api
        .getRegistrations(user.id)
        .then((data) => setRegistrations(data))
        .catch((err) => setError(err.message));
    }
  }, [user.id, user.role]);

  useEffect(() => {
    if (selectedCourseId && user.role === 'student') {
      setLoadingAgreement(true);
      api
        .getAgreementStatus({ studentId: user.id, courseId: selectedCourseId })
        .then((data) => setAgreementAccepted(Boolean(data.accepted)))
        .catch((err) => setError(err.message))
        .finally(() => setLoadingAgreement(false));
    } else {
      setAgreementAccepted(false);
    }
  }, [selectedCourseId, user.id, user.role]);

  const handleRegister = async () => {
    setError('');
    setSuccess('');

    if (!selectedCourseId) {
      setError('Select a course before registering.');
      return;
    }

    if (!agreementAccepted) {
      setError('Agreement must be accepted before you can register.');
      return;
    }

    setSaving(true);
    try {
      const { registration } = await api.registerCourse({ studentId: user.id, courseId: selectedCourseId });
      setRegistrations((prev) => {
        const exists = prev.find((item) => item.courseId === selectedCourseId);
        if (exists) {
          return prev;
        }
        return [registration, ...prev];
      });
      setSuccess('Registered successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (user.role !== 'student') {
    return (
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Registration</h2>
        <p>Students can register for courses once agreements are accepted.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Course Registration</h2>
      {!selectedCourseId && <p>Select a course from the course list page to start.</p>}

      {selectedCourse && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontWeight: 600 }}>{selectedCourse.title}</div>
          <div style={{ color: '#475569' }}>{selectedCourse.description}</div>
        </div>
      )}

      {loadingAgreement ? <div>Checking agreement status…</div> : <div>Agreement status: {agreementAccepted ? 'Accepted' : 'Pending'}</div>}

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <button type="button" className="button primary" onClick={handleRegister} disabled={saving || !selectedCourseId}>
        {saving ? 'Registering…' : 'Register for Course'}
      </button>

      <div style={{ marginTop: '2rem' }}>
        <h3>Your Registrations</h3>
        <ul className="list">
          {registrations.map((registration) => (
            <li key={registration._id} className="list-item">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{registration.courseId}</span>
                <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                  {new Date(registration.createdAt).toLocaleString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
        {!registrations.length && <p style={{ color: '#475569' }}>No registrations yet.</p>}
      </div>
    </div>
  );
}
