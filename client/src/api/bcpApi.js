import axios from "./axios";

export const getBcp = async (id) => {
  const { data } = await axios.get(`/bcp/${id}`);
  return data;
};

export const getBcps = async (params) => {
  const { data } = await axios.get('/bcps', { params });
  return data;
};

export const changeStatus = async (id) => {
  const { data } = await axios.put(`/bcp/${id}`);
  return data;
};

export const addObservations = async (id, observations) => {
  const { data } = await axios.put(`/bcp/${id}/observations`, { observations });
  return data;
};
