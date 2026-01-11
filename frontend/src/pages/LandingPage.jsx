import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="main-wrapper">
      <div className="card" style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h1 style={{ marginTop: 0, fontSize: '2.25rem' }}>CourseTrack Portal</h1>
        <p style={{ color: '#475569', fontSize: '1rem', marginBottom: '2rem' }}>
          Manage course enrolments with dedicated areas for students and the administrator. Choose how you would like to
          continue.
        </p>

        <div style={{ display: 'grid', gap: '1.25rem' }}>
          <section className="card" style={{ margin: 0, borderRadius: '10px', boxShadow: 'none' }}>
            <h2 style={{ marginTop: 0 }}>Student Login</h2>
            <p style={{ color: '#475569', marginBottom: '1.25rem' }}>
              Access your dashboard, browse courses, and register once your payments are cleared.
            </p>
            <Link className="button primary" to="/student/login" style={{ width: '100%', justifyContent: 'center' }}>
              Go to Student Login
            </Link>
          </section>

          <section className="card" style={{ margin: 0, borderRadius: '10px', boxShadow: 'none' }}>
            <h2 style={{ marginTop: 0 }}>Student Signup</h2>
            <p style={{ color: '#475569', marginBottom: '1.25rem' }}>
              New here? Create your student account to receive a unique 5-digit student ID.
            </p>
            <Link className="button secondary" to="/student/signup" style={{ width: '100%', justifyContent: 'center' }}>
              Create a Student Account
            </Link>
          </section>

          <section className="card" style={{ margin: 0, borderRadius: '10px', boxShadow: 'none' }}>
            <h2 style={{ marginTop: 0 }}>Admin Access</h2>
            <p style={{ color: '#475569', marginBottom: '1.25rem' }}>
              Administrators can add new courses and review paid registrations from this panel.
            </p>
            <Link className="button ghost" to="/admin/login" style={{ width: '100%', justifyContent: 'center' }}>
              Admin Login
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
