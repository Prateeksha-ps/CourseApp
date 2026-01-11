import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [student, setStudent] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const user = student || admin;

  const resetSession = useCallback(() => {
    setStudent(null);
    setAdmin(null);
    setCourses([]);
    setSelectedCourse(null);
    setRegistrations([]);
    setError('');
  }, []);

  const value = useMemo(
    () => ({
      apiBaseUrl,
      student,
      setStudent,
      admin,
      setAdmin,
      user,
      courses,
      setCourses,
      selectedCourse,
      setSelectedCourse,
      registrations,
      setRegistrations,
      loading,
      setLoading,
      error,
      setError,
      resetSession,
    }),
    [
      apiBaseUrl,
      student,
      admin,
      user,
      courses,
      selectedCourse,
      registrations,
      loading,
      error,
      resetSession,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
