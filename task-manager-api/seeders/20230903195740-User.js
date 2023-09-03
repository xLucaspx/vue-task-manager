"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("User", [
      {
        name: "Betty Botter",
        email: "betty@email.com",
        username: "betty01", // password: #bettyB01
        passwordHash:
          "517c414eda993bdf7c263670f93e96d81aab45ecc84ac680959d247d0dd7d7a60bb7ddbffac2b10ffaa8e6cbc6ce329c74047ab8341365cc48b14e96e9ed6e76",
        salt: "6553123f3617ebe308b5e733fd3c7256",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "John Doe",
        email: "john@email.com",
        username: "john01", // password: #johnD01
        passwordHash:
          "addddcf5e58b08235bdf7121996e5deabf2e4a9439375723a86dbded1cb0b5c53d3e6ff2f5ce50c5b1d4cb12da501fc177b0359f26ff4c2dad7274fdae3794c9",
        salt: "e2cd669747f693f1e0f4ab415699d4e8",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Jane Doe",
        email: "jane@email.com",
        username: "jane01", // password: #janeD01
        passwordHash:
          "203fb011afa8030dd0c4b120b793aba465c34ea081ffc1af217263104a78c93739781b46117b547b18a6f511dfd1369f9a3fae4bd225ad2f434eae583ad406c1",
        salt: "ef87fd83e1317feac0b9ed83819847ca",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.bulkDelete("User", null);
  },
};
