const DEFAULT_API_BASE_URL = `${window.location.origin}/api`;
const rawBaseUrl = import.meta.env.VITE_API_URL?.trim();
const isLocalOverride = rawBaseUrl && /^https?:\/\/localhost(?::\d+)?/i.test(rawBaseUrl);
const API_BASE_URL = ((rawBaseUrl && !isLocalOverride) ? rawBaseUrl : DEFAULT_API_BASE_URL).replace(/\/$/, '');

async function request(path, { method = 'GET', body, headers, ...rest } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'Request failed');
  }

  return data ?? {};
}

export const api = {
  registerStudent: (payload) =>
    request('/students/register', {
      method: 'POST',
      body: payload,
    }),
  loginStudent: (payload) =>
    request('/students/login', {
      method: 'POST',
      body: payload,
    }),
  loginAdmin: (payload) =>
    request('/admin/login', {
      method: 'POST',
      body: payload,
    }),
  getCourses: async () => {
    const data = await request('/courses');
    return Array.isArray(data) ? data : data?.courses ?? [];
  },
  getCourseById: async (courseId) => {
    const data = await request(`/courses/${courseId}`);
    return data?.course ?? data ?? null;
  },
  createCourse: (payload) =>
    request('/admin/courses', {
      method: 'POST',
      body: payload,
    }),
  registerForCourse: (payload) =>
    request('/register', {
      method: 'POST',
      body: payload,
    }),
  getStudentRegistrations: async (studentId) => {
    const data = await request(`/student/registrations?studentId=${studentId}`);
    return data?.registrations ?? [];
  },
  getAdminCourses: async () => {
    const data = await request('/admin/courses');
    return Array.isArray(data) ? data : data?.courses ?? [];
  },
  getCourseRegistrations: async (courseId) => {
    const data = await request(`/admin/course/${courseId}/registrations`);
    return data?.registrations ?? [];
  },
};
