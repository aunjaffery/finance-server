"use strict";
module.exports = (sequelize, DataTypes) => {
  var Users = sequelize.define(
    "Users",
    {
      fullName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: {
          msg: "This Email already exists",
        },
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 1,
      },
    },

    {
      freezeTableName: true,
    }
  );
  Users.associate = function (models) {
    Users.hasMany(models.Transactions, {
      as: "transactionuser",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      foreignKey: {
        name: "user_id",
        allowNull: false,
        field: "user_id",
      },
    });
    Users.hasMany(models.Clients, {
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

  return Users;
};
