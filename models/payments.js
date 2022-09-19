"use strict";
module.exports = (sequelize, DataTypes) => {
  var Payments = sequelize.define(
    "Payments",
    {
      paid_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      remaining_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      transaction_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
    }
  );
  Payments.associate = function (models) {
    Payments.belongsTo(models.Transactions, {
      as: "transactionpayment",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      foreignKey: {
        name: "transaction_id",
        allowNull: false,
        field: "transaction_id",
      },
    });
  };

  return Payments;
};
