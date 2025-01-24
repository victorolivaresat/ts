import axios from "./axios";

export const getMonthlyAmountSums = async () => {
  try {
    const response = await axios.get("/monthly-amount-sums");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getBcpDailyAmountsForChart = async () => {
  try {
    const response = await axios.get("/bcp-daily-amounts");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getIbkDailyAmountsForChart = async () => {
  try {
    const response = await axios.get("/ibk-daily-amounts");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
