import axios from "./axios";

export const login = async (email, password) => {
  const { data } = await axios.post("login", { email, password });
  return data;
};

export const logout = async () => {
  const { data } = await axios.post("logout");
  return data;
};

export const verifyToken = async () => {
  const { data } = await axios.get("verify-token");
  return data;
};

export const profile = async () => {
  const { data } = await axios.get("profile");
  return data;
};
