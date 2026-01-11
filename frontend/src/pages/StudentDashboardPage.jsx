import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAppContext } from '../context/AppContext';

export default function StudentDashboardPage() {
  const { student, courses, setCourses, registrations } = useAppContext();

  useEffect(() => {
    let isMounted = true;
    const fetchCourses = async () => {
      try {
        const data = await api.getCourses();
        if (isMounted) {
          setCourses(data);
        }
      } catch (error) {
        console.error('Failed to load courses', error);
      }
    };

    if (!courses.length) {
      fetchCourses();
    }

    return () => {
      isMounted = false;
    };
  }, [courses.length, setCourses]);

  return (
    <div className="main-wrapper" style={{ display: 'grid', gap: '1.5rem' }}>
      <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
        <h1 style={{ margin: 0 }}>Hello, {student.firstName}</h1>
        <p style={{ color: '#475569', margin: 0 }}>Manage your course registrations and payments here.</p>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#475569' }}>Student ID</div>
            <div style={{ fontWeight: 700 }}>{student.studentId}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#475569' }}>Email</div>
            <div style={{ fontWeight: 600 }}>{student.email}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#475569' }}>Registered Courses</div>
            <div style={{ fontWeight: 600 }}>{registrations.length}</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ display: 'grid', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0 }}>Available courses</h2>
          <p style={{ color: '#475569', margin: 0 }}>Choose a course to review details and complete registration.</p>
        </div>
        <div className="course-grid">
          {courses.map((course) => (
            <article key={course._id} className="course-card">
              {course.imageUrl && (
                <div className="course-card__media">
                  <img src={course.imageUrl} alt={`${course.courseName} cover`} loading="lazy" />
                </div>
              )}
              <div className="course-card__body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div>
                    <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.1rem' }}>{course.courseName}</h3>
                    <p style={{ margin: 0, color: '#475569' }}>{course.description}</p>
                  </div>
                  <Link className="button secondary" to={`/student/course/${course._id}`}>
                    View
                  </Link>
                </div>
                <div className="course-card__meta">
                  <span className="badge">Duration: {course.duration}</span>
                  <span className="badge" style={{ backgroundColor: 'rgba(14, 116, 144, 0.15)', color: '#0f766e' }}>
                    Fee: ₹{course.amount}
                  </span>
                  <span className="badge" style={{ backgroundColor: 'rgba(67, 56, 202, 0.12)', color: '#4338ca' }}>
                    Seats left: {course.seatsLeft}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
        {!courses.length && <p style={{ color: '#475569' }}>No courses published yet.</p>}
      </div>

      <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
        <h2 style={{ margin: 0 }}>Your registrations</h2>
        {!registrations.length && <p style={{ color: '#475569' }}>You have not registered for any courses yet.</p>}
        <ul className="list" style={{ display: 'grid', gap: '1rem' }}>
          {registrations.map((registration) => {
            const courseInfo = registration.course || {};
            return (
              <li key={registration._id} className="registration-card">
                {courseInfo.imageUrl && (
                  <div className="registration-card__media">
                    <img src={courseInfo.imageUrl} alt={`${courseInfo.courseName} course`} loading="lazy" />
                  </div>
                )}
                <div className="registration-card__body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.3rem', fontSize: '1rem' }}>{courseInfo.courseName ?? 'Course'}</h3>
                      <p style={{ margin: 0, color: '#475569', fontSize: '0.85rem' }}>
                        Registered on {new Date(registration.registeredAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="badge" style={{ backgroundColor: 'rgba(22, 163, 74, 0.15)', color: '#15803d' }}>
                      {registration.paymentStatus}
                    </span>
                  </div>
                  <div className="registration-card__meta">
                    <span className="badge" style={{ backgroundColor: 'rgba(37, 99, 235, 0.12)', color: '#1d4ed8' }}>
                      Agreement accepted
                    </span>
                    <span className="badge" style={{ backgroundColor: 'rgba(15, 118, 110, 0.12)', color: '#0f766e' }}>
                      Student ID: {registration.studentId}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
