// Centralized API utility — falls back to mock data if backend is unavailable
import { MOCK_INTERNSHIPS, MOCK_APPLICATIONS, MOCK_NOTIFICATIONS, MOCK_STATS, MOCK_APPLICANTS, MOCK_ANALYTICS } from './mockData';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('imp_token') : null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as Record<string, string> || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
    const data = await res.json();
    return data;
  } catch {
    return null; // Backend unavailable — caller handles fallback
  }
}

// AUTH
export const apiRegister = (body: Record<string, unknown>) => fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(body) });
export const apiLogin = (body: Record<string, unknown>) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(body) });
export const apiGetMe = () => fetchAPI('/auth/me');

// INTERNSHIPS (with mock fallback)
export async function apiGetInternships(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  const data = await fetchAPI(`/internships${qs}`);
  if (data?.success) return data;
  // Mock fallback
  let list = [...MOCK_INTERNSHIPS];
  if (params?.search) list = list.filter(i => i.title.toLowerCase().includes(params.search!.toLowerCase()));
  if (params?.locationType) list = list.filter(i => i.locationType === params.locationType);
  if (params?.category) list = list.filter(i => i.category === params.category);
  return { success: true, internships: list, total: list.length, mockMode: true };
}

export async function apiGetInternshipById(id: string) {
  const data = await fetchAPI(`/internships/${id}`);
  if (data?.success) return data;
  return { success: true, internship: MOCK_INTERNSHIPS.find(i => i._id === id) || MOCK_INTERNSHIPS[0], mockMode: true };
}

export const apiCreateInternship = (body: Record<string, unknown>) => fetchAPI('/internships', { method: 'POST', body: JSON.stringify(body) });
export const apiUpdateInternship = (id: string, body: Record<string, unknown>) => fetchAPI(`/internships/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const apiDeleteInternship = (id: string) => fetchAPI(`/internships/${id}`, { method: 'DELETE' });

// STUDENT
export async function apiGetStudentProfile() {
  const data = await fetchAPI('/student/profile');
  if (data?.success) return data;
  return { success: true, student: { phone: '', college: 'IIT Delhi', degree: 'B.Tech CS', year: '3rd Year', skills: ['React', 'TypeScript'], bio: 'Passionate developer...', resumeUrl: '#', profileStrength: 75, badges: ['Resume Ready', 'Skilled', 'Verified Student'] }, mockMode: true };
}
export const apiUpdateStudentProfile = (body: Record<string, unknown>) => fetchAPI('/student/profile', { method: 'PUT', body: JSON.stringify(body) });

// APPLICATIONS
export async function apiGetMyApplications() {
  const data = await fetchAPI('/student/applications');
  if (data?.success) return data;
  return { success: true, applications: MOCK_APPLICATIONS, mockMode: true };
}
export const apiApply = (body: Record<string, unknown>) => fetchAPI('/applications', { method: 'POST', body: JSON.stringify(body) });

// RECRUITER
export async function apiGetApplicants(params?: Record<string, string>) {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  const data = await fetchAPI(`/applications${qs}`);
  if (data?.success) return data;
  return { success: true, applications: MOCK_APPLICANTS, mockMode: true };
}
export const apiUpdateStatus = (id: string, body: Record<string, unknown>) => fetchAPI(`/applications/${id}/status`, { method: 'PUT', body: JSON.stringify(body) });

// ADMIN
export async function apiGetAdminStats() {
  const data = await fetchAPI('/admin/stats');
  if (data?.success) return data;
  return { success: true, stats: MOCK_STATS, mockMode: true };
}
export async function apiGetAllUsers() {
  const data = await fetchAPI('/admin/users');
  if (data?.success) return data;
  return { success: true, users: [
    { _id: 'u1', name: 'Priya Sharma', email: 'priya@email.com', role: 'student', status: 'active', createdAt: '2024-06-01' },
    { _id: 'u2', name: 'TechNova Labs', email: 'hr@technova.com', role: 'recruiter', status: 'active', createdAt: '2024-05-20' },
    { _id: 'u3', name: 'Arjun Mehta', email: 'arjun@email.com', role: 'student', status: 'active', createdAt: '2024-06-05' },
    { _id: 'u4', name: 'DataMind AI', email: 'careers@datamind.ai', role: 'recruiter', status: 'pending', createdAt: '2024-06-18' },
    { _id: 'u5', name: 'Sneha Reddy', email: 'sneha@email.com', role: 'student', status: 'active', createdAt: '2024-06-08' },
  ], mockMode: true };
}
export async function apiGetAnalytics() {
  const data = await fetchAPI('/admin/analytics');
  if (data?.success) return data;
  return { success: true, analytics: MOCK_ANALYTICS, mockMode: true };
}
export const apiDeleteUser = (id: string) => fetchAPI(`/admin/users/${id}`, { method: 'DELETE' });
export async function apiGetPendingCompanies() {
  const data = await fetchAPI('/admin/companies/pending');
  if (data?.success) return data;
  return { success: true, companies: [
    { _id: 'c9', companyName: 'StartupXYZ', industry: 'Fintech', location: 'Pune', userId: { name: 'Recruiter A', email: 'hr@startupxyz.com' } },
    { _id: 'c10', companyName: 'DataMind AI', industry: 'AI/ML', location: 'Remote', userId: { name: 'Recruiter B', email: 'careers@datamind.ai' } },
  ], mockMode: true };
}
export const apiApproveCompany = (id: string) => fetchAPI(`/admin/companies/${id}/approve`, { method: 'PUT' });

// NOTIFICATIONS
export async function apiGetNotifications() {
  const data = await fetchAPI('/notifications');
  if (data?.success) return data;
  return { success: true, notifications: MOCK_NOTIFICATIONS, mockMode: true };
}
export const apiMarkRead = (id: string) => fetchAPI(`/notifications/${id}/read`, { method: 'PUT' });
export const apiMarkAllRead = () => fetchAPI('/notifications/read-all', { method: 'PUT' });
