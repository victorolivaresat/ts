const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database").sequelize;
const Ibk = require("./Ibk");
const At = require("./At");

class IbkReconciliation extends Model {}

IbkReconciliation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    at_data_id: {
      type: DataTypes.INTEGER,
      references: {
        model: At,
        key: "id",
      },
      allowNull: false,
    },
    ibk_notification_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Ibk,
        key: "id",
      },
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    score: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "IbkReconciliation",
    tableName: "ibk_reconciliations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

IbkReconciliation.belongsTo(At, {
  foreignKey: "at_data_id",
  as: "at",
});

IbkReconciliation.belongsTo(Ibk, {
  foreignKey: "ibk_notification_id",
  as: "ibk",
});

module.exports = IbkReconciliation;
