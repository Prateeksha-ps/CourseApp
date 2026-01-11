import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { useAppContext } from '../context/AppContext';

export default function CourseDetailsPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { student, setCourses, registrations, setRegistrations } = useAppContext();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [agreementChoice, setAgreementChoice] = useState('');
  const [agreementError, setAgreementError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchCourse = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await api.getCourseById(courseId);
        if (isMounted) {
          setCourse(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load course details.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCourse();
    return () => {
      isMounted = false;
    };
  }, [courseId]);

  const alreadyRegistered = useMemo(
    () =>
      registrations.some((registration) => {
        const registrationCourseId = registration.course?._id || registration.course;
        return registrationCourseId === courseId;
      }),
    [registrations, courseId]
  );

  const submitRegistration = async () => {
    if (!student || !course) {
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccessMessage('');
    try {
      await api.registerForCourse({
        studentId: student.studentId,
        courseId: course._id,
        paymentStatus: 'Paid',
        agreementAccepted: true,
      });

      const [updatedRegistrations, updatedCourses] = await Promise.all([
        api.getStudentRegistrations(student.studentId),
        api.getCourses(),
      ]);

      setRegistrations(updatedRegistrations);
      setCourses(updatedCourses);
      setSuccessMessage('Registration confirmed! You are enrolled in this course.');
      setAgreementChoice('');
    } catch (err) {
      setError(err.message || 'Unable to complete registration.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenAgreement = () => {
    if (!student) {
      navigate('/student/login', { replace: true });
      return;
    }

    if (!course || alreadyRegistered || (course.seatsLeft ?? 0) <= 0) {
      return;
    }

    setAgreementChoice('');
    setAgreementError('');
    setShowAgreementModal(true);
  };

  const handleConfirmAgreement = async () => {
    if (agreementChoice !== 'accept') {
      setAgreementError('You must accept the agreement to continue.');
      return;
    }

    setAgreementError('');
    setShowAgreementModal(false);
    await submitRegistration();
  };

  const handleCancelAgreement = () => {
    if (!submitting) {
      setShowAgreementModal(false);
      setAgreementChoice('');
      setAgreementError('');
    }
  };

  if (loading) {
    return (
      <div className="main-wrapper" style={{ display: 'grid', placeItems: 'center' }}>
        <div className="card" style={{ maxWidth: '420px', width: '100%', textAlign: 'center' }}>
          <p style={{ margin: 0 }}>Loading course details…</p>
        </div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="main-wrapper" style={{ display: 'grid', placeItems: 'center' }}>
        <div className="card" style={{ maxWidth: '420px', width: '100%', textAlign: 'center' }}>
          <p style={{ color: '#dc2626', marginBottom: '1rem' }}>{error}</p>
          <button className="button secondary" onClick={() => navigate(-1)}>
            Go back
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  const seatsLeft = course.seatsLeft ?? 0;
  const prerequisites = Array.isArray(course.prerequisites)
    ? course.prerequisites
    : (course.prerequisites || '')
        .toString()
        .split(/[,\n]/)
        .map((item) => item.trim())
        .filter(Boolean);

  return (
    <div className="main-wrapper" style={{ display: 'grid', gap: '1.5rem' }}>
      <div className="card" style={{ display: 'grid', gap: '1rem' }}>
        {course.imageUrl && (
          <div style={{ borderRadius: '10px', overflow: 'hidden', maxHeight: '260px' }}>
            <img
              src={course.imageUrl}
              alt={`${course.courseName} course graphic`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              loading="lazy"
            />
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0 }}>{course.courseName}</h1>
          <Link className="button secondary" to="/student/dashboard">
            Back to dashboard
          </Link>
        </div>
        <p style={{ margin: 0, color: '#475569', lineHeight: 1.6 }}>{course.description}</p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span className="badge">Duration: {course.duration}</span>
          <span className="badge" style={{ backgroundColor: 'rgba(14, 116, 144, 0.15)', color: '#0f766e' }}>
            Course fee: ₹{course.amount}
          </span>
          <span className="badge" style={{ backgroundColor: 'rgba(67, 56, 202, 0.12)', color: '#4338ca' }}>
            Seats left: {seatsLeft}
          </span>
        </div>
        {!!prerequisites.length && (
          <div>
            <h3 style={{ margin: '0 0 0.5rem' }}>Prerequisites</h3>
            <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'grid', gap: '0.25rem' }}>
              {prerequisites.map((item) => (
                <li key={item} style={{ color: '#334155' }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="card" style={{ display: 'grid', gap: '1rem', maxWidth: '520px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Complete your registration</h2>
          <p style={{ margin: 0, color: '#475569' }}>
            Registration requires your payment status to be marked as <strong>Paid</strong>.
          </p>
        </div>

        {successMessage && <div className="success">{successMessage}</div>}
        {error && <div className="error">{error}</div>}

        <button
          className="button primary"
          onClick={handleOpenAgreement}
          disabled={submitting || alreadyRegistered || seatsLeft <= 0}
          style={{ width: '100%' }}
        >
          {alreadyRegistered
            ? 'Already registered'
            : seatsLeft <= 0
            ? 'Course full'
            : submitting
            ? 'Processing…'
            : 'Pay & Register'}
        </button>
      </div>
      {showAgreementModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2 style={{ margin: 0 }}>Course Completion and Certification Agreement</h2>
            <div className="modal-body">
              <p>
                By registering for this course, the student acknowledges and agrees that successful completion of the course requires
                100% completion of all prescribed modules, lessons, and assigned activities. The student must actively participate in
                the course and fulfill all academic requirements within the specified duration.
              </p>
              <p>
                In addition, the student is required to appear for and successfully complete the final examination associated with the
                course. Only students who meet both conditions—full course completion and completion of the final assessment—will be
                eligible to receive the course completion certificate. Failure to satisfy these requirements will result in
                ineligibility for certification, irrespective of course registration status.
              </p>
            </div>
            <div className="modal-options">
              <label className="modal-option">
                <input
                  type="radio"
                  name="agreement"
                  value="accept"
                  checked={agreementChoice === 'accept'}
                  onChange={(event) => setAgreementChoice(event.target.value)}
                />
                I accept the agreement
              </label>
              <label className="modal-option">
                <input
                  type="radio"
                  name="agreement"
                  value="decline"
                  checked={agreementChoice === 'decline'}
                  onChange={(event) => setAgreementChoice(event.target.value)}
                />
                I do not accept the agreement
              </label>
            </div>
            {agreementError && <div className="error" style={{ marginTop: 0 }}>{agreementError}</div>}
            <div className="modal-actions">
              <button type="button" className="button ghost" onClick={handleCancelAgreement} disabled={submitting}>
                Cancel
              </button>
              <button
                type="button"
                className="button primary"
                onClick={handleConfirmAgreement}
                disabled={submitting}
              >
                {submitting ? 'Processing…' : 'Confirm & Register'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
