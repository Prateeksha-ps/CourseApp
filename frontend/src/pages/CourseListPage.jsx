import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { useAppContext } from '../context/AppContext';

export default function CourseListPage() {
  const { courses, setCourses, user, selectedCourseId, setSelectedCourseId } = useAppContext();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ courseId: '', title: '', description: '', duration: '' });

  useEffect(() => {
    if (!courses.length) {
      setLoading(true);
      api
        .getCourses()
        .then((data) => setCourses(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [courses.length, setCourses]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.courseId.trim() || !form.title.trim() || !form.description.trim() || !form.duration.trim()) {
      setError('All fields are required.');
      return;
    }

    try {
      const payload = {
        courseId: form.courseId.trim(),
        title: form.title.trim(),
        description: form.description.trim(),
        duration: form.duration.trim(),
      };
      const newCourse = await api.createCourse(payload);
      setCourses((prev) => [newCourse, ...prev]);
      setForm({ courseId: '', title: '', description: '', duration: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const courseList = useMemo(() => courses.sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [courses]);

  const handleSelectCourse = (courseId) => {
    setSelectedCourseId(courseId);
  };

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Courses</h2>
      <p style={{ color: '#475569', marginBottom: '1.5rem' }}>
        {user.role === 'admin'
          ? 'Create courses and track enrollment.'
          : 'Select a course to proceed with agreements and registration.'}
      </p>

      {user.role === 'admin' && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div className="form-control">
            <label htmlFor="courseId">Course ID</label>
            <input id="courseId" name="courseId" value={form.courseId} onChange={handleChange} placeholder="eg. CS101" />
          </div>
          <div className="form-control">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" value={form.title} onChange={handleChange} placeholder="Introduction to Computer Science" />
          </div>
          <div className="form-control">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Course overview"
            />
          </div>
          <div className="form-control">
            <label htmlFor="duration">Duration</label>
            <input id="duration" name="duration" value={form.duration} onChange={handleChange} placeholder="8 weeks" />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="button primary">
            Create Course
          </button>
        </form>
      )}

      {loading && <div>Loading courses…</div>}
      {!loading && !courses.length && <div>No courses available yet.</div>}

      <ul className="list">
        {courseList.map((course) => (
          <li className="list-item" key={course._id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{course.title}</div>
                <div style={{ fontSize: '0.9rem', color: '#475569' }}>{course.description}</div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.35rem' }}>
                  <span className="badge">{course.courseId}</span>
                  <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#047857' }}>
                    {course.duration}
                  </span>
                </div>
              </div>
              {user.role === 'student' && (
                <button
                  type="button"
                  className={`button ${selectedCourseId === course.courseId ? 'secondary' : 'ghost'}`}
                  onClick={() => handleSelectCourse(course.courseId)}
                >
                  {selectedCourseId === course.courseId ? 'Selected' : 'Select'}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
