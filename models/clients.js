"use strict";
module.exports = (sequelize, DataTypes) => {
  var Clients = sequelize.define(
    "Clients",
    {
      fullName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      relation: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      total_lent: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      total_borrowed: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      last_transaction: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      pending: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      freezeTableName: true,
    }
  );
  Clients.associate = function (models) {
    Clients.hasMany(models.Transactions, {
      as: "transactionclient",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      foreignKey: {
        name: "client_id",
        allowNull: false,
        field: "client_id",
      },
    });
    Clients.belongsTo(models.Users, {
      as: "userclients",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      foreignKey: {
        name: "user_id",
        allowNull: false,
        field: "user_id",
      },
    });
  };

  return Clients;
};
