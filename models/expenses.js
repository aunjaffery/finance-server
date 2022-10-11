"use strict";
module.exports = (sequelize, DataTypes) => {
  var Expenses = sequelize.define(
    "Expenses",
    {
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "expense",
      },
      expense_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },

    {
      freezeTableName: true,
    }
  );
  Expenses.associate = function (models) {
    Expenses.belongsTo(models.Users, {
      as: "userexpense",
      constraints: false,
      foreignKey: {
        name: "user_id",
        allowNull: false,
        field: "user_id",
      },
    });
  };
  return Expenses;
};
