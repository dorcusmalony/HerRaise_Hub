import { loginRequest, registerRequest, setAuthToken } from '../apiClient';

export const login = async (payload: { email: string; password: string }) => {
	// ensure payload shape matches backend
	const res = await loginRequest(payload);
	const data = res.data;
	if (data?.token) {
		localStorage.setItem('token', data.token);
		localStorage.setItem('user', JSON.stringify(data.user || {}));
		setAuthToken(data.token);
	}
	return data;
};

export const register = async (payload: Record<string, any>) => {
	const res = await registerRequest(payload);
	const data = res.data;
	if (data?.token) {
		localStorage.setItem('token', data.token);
		localStorage.setItem('user', JSON.stringify(data.user || {}));
		setAuthToken(data.token);
	}
	return data;
};

export const logout = () => {
	localStorage.removeItem('token');
	localStorage.removeItem('user');
	setAuthToken(undefined);
};