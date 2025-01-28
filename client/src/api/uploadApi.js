import axios from "./axios";

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await axios.post("/upload-excel", formData);
  return data;
};

export const getRecentNotificationSums = async () => {
  const { data } = await axios.get("/recent-notification-sums");
  return data;
};