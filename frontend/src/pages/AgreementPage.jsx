import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { useAppContext } from '../context/AppContext';

export default function AgreementPage() {
  const { user, selectedCourseId, courses } = useAppContext();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const selectedCourse = useMemo(
    () => courses.find((course) => course.courseId === selectedCourseId),
    [courses, selectedCourseId]
  );

  useEffect(() => {
    if (selectedCourseId) {
      setLoading(true);
      api
        .getAgreementStatus({ studentId: user.id, courseId: selectedCourseId })
        .then((data) => setStatus(data.accepted))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [selectedCourseId, user.id]);

  const handleAccept = async () => {
    if (!selectedCourseId) {
      setError('Select a course before accepting the agreement.');
      return;
    }
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await api.acceptAgreement({ studentId: user.id, courseId: selectedCourseId });
      setStatus(true);
      setMessage('Agreement accepted. You can now register.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedCourseId) {
    return (
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Agreements</h2>
        <p>Select a course from the courses page to proceed.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Course Agreement</h2>
      {selectedCourse && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontWeight: 600 }}>{selectedCourse.title}</div>
          <div style={{ color: '#475569' }}>{selectedCourse.description}</div>
        </div>
      )}
      <p style={{ color: '#475569' }}>
        Please read and accept the terms before registering for this course. Acceptance confirms you understand the
        course requirements and certification criteria.
      </p>
      {status && <div className="success">Agreement already accepted.</div>}
      {message && <div className="success">{message}</div>}
      {error && <div className="error">{error}</div>}
      <button type="button" className="button primary" onClick={handleAccept} disabled={loading || status}>
        {status ? 'Agreement Accepted' : loading ? 'Submitting…' : 'Accept Agreement'}
      </button>
    </div>
  );
}
