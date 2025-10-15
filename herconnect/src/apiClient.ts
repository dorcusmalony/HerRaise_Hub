import axios from 'axios';

const rawBase = (import.meta as any).env.VITE_API_URL || 'http://localhost:5173';
const BASE_URL = rawBase.replace(/\/+$/, ''); // remove trailing slash

const api = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

export const setAuthToken = (token?: string) => {
	if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	else delete api.defaults.headers.common['Authorization'];
};

// simple endpoint helpers (adjust paths if your backend uses /api/*)
export const loginRequest = (payload: Record<string, any>) => api.post('/login', payload);
export const registerRequest = (payload: Record<string, any>) => api.post('/register', payload);

export default api;