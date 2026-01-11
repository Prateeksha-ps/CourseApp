import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { useAppContext } from '../context/AppContext';

const INITIAL_FORM = {
  courseName: '',
  description: '',
  duration: '',
  amount: '',
  prerequisites: '',
  maxRegistrations: '',
  imageUrl: '',
};

export default function AdminDashboardPage() {
  const { admin, courses, setCourses } = useAppContext();
  const [form, setForm] = useState(INITIAL_FORM);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let isMounted = true;
    const loadCourses = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api.getAdminCourses();
        if (isMounted) {
          setCourses(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCourses();
    return () => {
      isMounted = false;
    };
  }, [setCourses]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!selectedCourseId) {
        setRegistrations([]);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const data = await api.getCourseRegistrations(selectedCourseId);
        setRegistrations(data);
      } catch (err) {
        setError(err.message);
        setRegistrations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [selectedCourseId]);

  const courseOptions = useMemo(
    () =>
      [...courses]
        .sort((a, b) => a.courseName.localeCompare(b.courseName))
        .map((course) => ({ id: course._id, label: `${course.courseName} (${course.seatsLeft} seats left)` })),
    [courses]
  );

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCourseSelect = (event) => {
    setSelectedCourseId(event.target.value);
  };

  const handleCreateCourse = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.courseName || !form.description || !form.duration || !form.amount || !form.maxRegistrations) {
      setError('Please fill out all required course fields.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        amount: Number(form.amount),
        maxRegistrations: Number(form.maxRegistrations),
        imageUrl: form.imageUrl.trim(),
      };
      const { course } = await api.createCourse(payload);
      setCourses((prev) => [course, ...prev]);
      setForm(INITIAL_FORM);
      setSuccess('Course created successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="main-wrapper" style={{ display: 'grid', gap: '1.5rem' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ marginTop: 0 }}>Welcome, {admin?.username ?? 'Admin'}</h1>
            <p style={{ color: '#475569' }}>Create courses and monitor student registrations.</p>
          </div>
        </div>

        <form onSubmit={handleCreateCourse} style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
          <div className="form-control">
            <label htmlFor="courseName">Course name</label>
            <input
              id="courseName"
              name="courseName"
              value={form.courseName}
              onChange={handleFormChange}
              placeholder="Full Stack Web Development"
            />
          </div>
          <div className="form-control">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleFormChange}
              placeholder="Describe the course content"
            />
          </div>
          <div className="form-control">
            <label htmlFor="duration">Duration</label>
            <input
              id="duration"
              name="duration"
              value={form.duration}
              onChange={handleFormChange}
              placeholder="8 weeks"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div className="form-control">
              <label htmlFor="amount">Fee amount (INR)</label>
              <input
                id="amount"
                name="amount"
                type="number"
                min="0"
                value={form.amount}
                onChange={handleFormChange}
                placeholder="15000"
              />
            </div>
            <div className="form-control">
              <label htmlFor="maxRegistrations">Maximum seats</label>
              <input
                id="maxRegistrations"
                name="maxRegistrations"
                type="number"
                min="1"
                value={form.maxRegistrations}
                onChange={handleFormChange}
                placeholder="25"
              />
            </div>
          </div>
          <div className="form-control">
            <label htmlFor="imageUrl">Course image URL</label>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={form.imageUrl}
              onChange={handleFormChange}
              placeholder="https://example.com/course-image.jpg"
            />
            <small style={{ color: '#64748b' }}>Provide a publicly accessible image link (JPEG/PNG).</small>
          </div>
          <div className="form-control">
            <label htmlFor="prerequisites">Prerequisites (optional)</label>
            <input
              id="prerequisites"
              name="prerequisites"
              value={form.prerequisites}
              onChange={handleFormChange}
              placeholder="Prior HTML/CSS knowledge"
            />
          </div>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <button type="submit" className="button primary" disabled={saving}>
            {saving ? 'Saving course…' : 'Create course'}
          </button>
        </form>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>Course Registrations</h2>
        </div>
        <div className="form-control" style={{ marginTop: '1rem' }}>
          <label htmlFor="courseSelect">Select course</label>
          <select id="courseSelect" value={selectedCourseId} onChange={handleCourseSelect}>
            <option value="">Choose a course</option>
            {courseOptions.map((course) => (
              <option key={course.id} value={course.id}>
                {course.label}
              </option>
            ))}
          </select>
        </div>

        {loading && <div style={{ marginTop: '1rem' }}>Loading data…</div>}
        {!loading && selectedCourseId && !registrations.length && (
          <p style={{ color: '#475569' }}>No paid registrations yet for this course.</p>
        )}

        <ul className="list" style={{ marginTop: '1rem' }}>
          {registrations.map((entry) => (
            <li key={entry.registrationId} className="list-item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>
                    {entry.student?.firstName} {entry.student?.lastName}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#475569' }}>ID: {entry.student?.studentId}</div>
                </div>
                <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#047857' }}>
                  {entry.paymentStatus}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
