import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const NAV_LINKS = [
  { to: '/courses', label: 'Courses', roles: ['admin', 'student'] },
  { to: '/agreements', label: 'Agreements', roles: ['student'] },
  { to: '/register', label: 'Registration', roles: ['student'] },
  { to: '/admin', label: 'Admin', roles: ['admin'] },
];

export default function Layout({ children }) {
  const { user, setUser, setSelectedCourseId } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    setSelectedCourseId('');
    navigate('/');
  };

  return (
    <div>
      <header className="header-bar">
        <div className="header-inner">
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>CourseTrack</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Course registration & certification</div>
          </div>
          <nav className="nav-links">
            {NAV_LINKS.filter((item) => item.roles.includes(user.role)).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`nav-link${location.pathname === item.to ? ' active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
            <button type="button" className="button ghost" onClick={handleLogout}>
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="main-wrapper">{children}</main>
    </div>
  );
}
