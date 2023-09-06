"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      Task.belongsTo(models.User, {
        foreignKey: { name: "userId", allowNull: false },
        onDelete: "CASCADE",
      });
    }
  }

  Task.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      description: {
        type: new DataTypes.STRING(125),
        allowNull: false,
        validate: { notEmpty: true, len: [3, 125] },
      },
      completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Task",
      freezeTableName: true,
      defaultScope: {
        attributes: ["id", "description", "completed", "userId"],
      },
    }
  );

  return Task;
};
