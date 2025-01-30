const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../../config/database").sequelize;
const Bcp = require("./Bcp");
const At = require("./At");

class BcpReconciliation extends Model {}

BcpReconciliation.init(
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
        key: 'id',
      },
      allowNull: false,
    },
    bcp_notification_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Bcp,
        key: 'id',
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
    modelName: "BcpReconciliation",
    tableName: "bcp_reconciliations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

BcpReconciliation.belongsTo(At, {
  foreignKey: 'at_data_id',
  as: 'at',
});

BcpReconciliation.belongsTo(Bcp, {
  foreignKey: 'bcp_notification_id',
  as: 'bcp',
});

module.exports = BcpReconciliation;
