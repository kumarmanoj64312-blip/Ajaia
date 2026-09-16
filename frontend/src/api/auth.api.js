import axiosClient from './axiosClient';

export async function login(email, password) {
  const res = await axiosClient.post('/auth/login', { email, password });
  return res.data.data;
}

export async function register(name, email, password) {
  const res = await axiosClient.post('/auth/register', { name, email, password });
  return res.data.data;
}

export async function fetchMe() {
  const res = await axiosClient.get('/auth/me');
  return res.data.data;
}
