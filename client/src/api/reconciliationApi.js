import axios from "./axios";

export const getIbkReconciliation = async (id) => {
  const { data } = await axios.get(`/ibk-reconciliation/${id}`);
  return data;
};

export const getIbkReconciliations = async (params) => {
  const { data } = await axios.get("/ibk-reconciliations", { params });
  return data;
};
export const getBcpReconciliation = async (id) => {
  const { data } = await axios.get(`/bcp-reconciliation/${id}`);
  return data;
};

export const getBcpReconciliations = async (params) => {
  const { data } = await axios.get("/bcp-reconciliations", { params });
  return data;
};
