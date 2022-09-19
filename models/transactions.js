"use strict";
module.exports = (sequelize, DataTypes) => {
  var Transactions = sequelize.define(
    "Transactions",
    {
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(100),
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
      last_transaction: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },

    {
      freezeTableName: true,
    }
  );
  Transactions.associate = function (models) {
    Transactions.hasMany(models.Payments, {
      as: "transactionpayment",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      foreignKey: {
        name: "transaction_id",
        allowNull: false,
        field: "transaction_id",
      },
    });
    Transactions.belongsTo(models.Users, {
      as: "transactionuser",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      foreignKey: {
        name: "user_id",
        allowNull: false,
        field: "user_id",
      },
    });
    Transactions.belongsTo(models.Clients, {
      as: "transactionclient",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      foreignKey: {
        name: "client_id",
        allowNull: false,
        field: "client_id",
      },
    });
  };

  return Transactions;
};
