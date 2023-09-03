"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Task", [
      {
        description: "Buy some butter",
        completed: true,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: "Buy some better butter",
        completed: false,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: "Finish homework",
        completed: false,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: "Clean bedroom",
        completed: false,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: "Study for test",
        completed: true,
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: "Read new book",
        completed: true,
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return await queryInterface.bulkDelete("Task", null);
  },
};
