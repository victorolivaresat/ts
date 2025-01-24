const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database").sequelize;

class Bcp extends Model {}

Bcp.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    operation_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    operation_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ordering_company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_charge: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    beneficiary: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
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
      defaultValue: Sequelize.fn('GETDATE') 
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.fn('GETDATE') 
    },
  },
  {
    sequelize,
    modelName: "Bcp",
    tableName: "bcp_notifications",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Bcp;