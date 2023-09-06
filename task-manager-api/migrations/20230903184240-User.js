"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("User", {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      name: { allowNull: false, type: new Sequelize.STRING(75) },
      email: { allowNull: false, unique: true, type: new Sequelize.STRING(50) },
      username: {
        allowNull: false,
        unique: true,
        type: new Sequelize.STRING(20),
      },
      passwordHash: { allowNull: false, type: new Sequelize.STRING(128) },
      salt: { allowNull: false, type: new Sequelize.STRING(32) },
      createdAt: { type: Sequelize.DATE },
      updatedAt: { type: Sequelize.DATE },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("User");
  },
};
