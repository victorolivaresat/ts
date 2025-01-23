import axios from "./axios";

export const createUser = async (userData) => {
  const { data } = await axios.post('/users', userData);
  return data;
};

export const updateUser = async (id, userData) => {
  const { data } = await axios.put(`/users/${id}`, userData);
  return data;
};

export const getAllUsers = async (params) => {
  const { data } = await axios.get('/users', { params });
  return data;
};


export const getUser = async (id) => {
  const { data } = await axios.get(`/users/${id}`);
  return data;
};

export const changeUserStatus = async (id, status) => {
  const { data } = await axios.patch(`/users/${id}/status`, { status });
  return data;
};