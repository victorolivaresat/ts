const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("ts_at", "dba_pf", "P455w0rd_pf", {
  host: "192.168.21.35",
  dialect: "mssql",
  port: 1433,
});

const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { sequelize, connect };
