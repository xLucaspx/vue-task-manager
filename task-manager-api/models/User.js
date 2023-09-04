"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Task, {
        foreignKey: { name: "userId", allowNull: false },
        onDelete: "CASCADE",
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: new DataTypes.STRING(75),
        allowNull: false,
        validate: { notEmpty: true, len: [3, 75] },
      },
      email: {
        type: new DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [10, 50],
          is: /\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+/g,
        },
      },
      username: {
        type: new DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: { notEmpty: true, len: [3, 20], is: /^[\w-]*$/g },
      },
      passwordHash: {
        type: new DataTypes.STRING(128),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [128, 128],
        },
      },
      salt: {
        type: new DataTypes.STRING(32),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [32, 32],
        },
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
      freezeTableName: true,
      defaultScope: {
        attributes: ["id", "name", "email", "username"],
        include: ["Tasks"],
      },
      scopes: {
        login: {
          attributes: ["id", "name", "passwordHash", "salt"],
        },
      },
    }
  );

  return User;
};
