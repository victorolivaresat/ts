const { sequelize } = require("../../config/database");

const getMonthlyAmountSums = async (req, res) => {
  try {
    const results = await sequelize.query("EXEC GetMonthlyAmountSums", {
      type: sequelize.QueryTypes.SELECT,
    });

    const ibkResult = results.find(result => result.source === 'ibk');
    const bcpResult = results.find(result => result.source === 'bcp');
    const atResult = results.find(result => result.source === 'at');

    res.json({
      ibkTotalAmount: ibkResult ? ibkResult.totalAmount : 0,
      bcpTotalAmount: bcpResult ? bcpResult.totalAmount : 0,
      atTotalAmount: atResult ? atResult.totalAmount : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBcpDailyAmountsForChart = async (req, res) => {
  try {
    const results = await sequelize.query("EXEC GetBcpDailyAmountsForChart", {
      type: sequelize.QueryTypes.SELECT,
    });

    const categories = results.map(row => row.Date);
    const seriesData = results.map(row => row.TotalAmount);

    res.json({
      categories,
      series: [
        {
          name: "Daily Amount",
          data: seriesData,
        },
      ],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getIbkDailyAmountsForChart = async (req, res) => {
  try {
    const results = await sequelize.query("EXEC GetIbkDailyAmountsForChart", {
      type: sequelize.QueryTypes.SELECT,
    });

    const categories = results.map(row => row.Date); 
    const seriesData = results.map(row => row.TotalAmount);

    res.json({
      categories,
      series: [
        {
          name: "Interbank Daily Amount",
          data: seriesData,
        },
      ],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMonthlyAmountSums,
  getBcpDailyAmountsForChart,
  getIbkDailyAmountsForChart,

};