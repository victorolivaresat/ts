const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database").sequelize;

class Ibk extends Model {}

Ibk.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ordering_company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    beneficiary: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_charge: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payment_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number_application: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    date_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    observations: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Ibk",
    tableName: "ibk_notifications",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Ibk;