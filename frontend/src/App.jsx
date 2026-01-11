import { Navigate, Route, Routes } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import StudentSignupPage from './pages/StudentSignupPage';
import StudentLoginPage from './pages/StudentLoginPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function StudentRoute({ children }) {
  const { student } = useAppContext();
  if (!student) {
    return <Navigate to="/student/login" replace />;
  }
  return children;
}

function AdminRoute({ children }) {
  const { admin } = useAppContext();
  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/student/signup" element={<StudentSignupPage />} />
      <Route path="/student/login" element={<StudentLoginPage />} />
      <Route
        path="/student/dashboard"
        element={
          <StudentRoute>
            <StudentDashboardPage />
          </StudentRoute>
        }
      />
      <Route
        path="/student/course/:courseId"
        element={
          <StudentRoute>
            <CourseDetailsPage />
          </StudentRoute>
        }
      />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
