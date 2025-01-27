import axios from "./axios";

export const getIbk = async (id) => {
  const { data } = await axios.get(`/ibk/${id}`);
  return data;
};

export const getIbks = async (params) => {
  const { data } = await axios.get('/ibks', { params });
  return data;
};

export const changeStatus = async (id) => {
  const { data } = await axios.put(`/ibk/${id}`);
  return data;
};

export const addObservations = async (id, observations) => {
  const { data } = await axios.put(`/ibk/${id}/observations`, { observations });
  return data;
};
