const { ValidationError } = require("sequelize");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../errors");
const Services = require("./Services");

class TaskServices extends Services {
  constructor() {
    super("Task");
  }

  async getUserTasks(userId) {
    try {
      return await this.getRecords({ userId });
    } catch (error) {
      throw error;
    }
  }

  async getTaskById(id, userId) {
    try {
      const task = await this.getOneRecord({ id });

      if (userId != task.userId) {
        throw new UnauthorizedError(
          "It's not possible to fetch another users' tasks!"
        );
      }

      return task;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundError("Task not found!");
      }
      throw error;
    }
  }

  async createTask(task) {
    try {
      return await this.createRecord(task);
    } catch (error) {
      this.#checkTaskValidationError(error);
      throw error;
    }
  }

  async updateTask(id, data, userId) {
    try {
      const task = await this.getTaskById(id, userId);

      if (data.id && data.id !== task.id) {
        throw new UnauthorizedError("It's not allowed to alter the task's ID!");
      }

      if (data.userId && data.userId !== task.userId) {
        throw new UnauthorizedError(
          "It's not allowed to alter the task's user ID!"
        );
      }

      return await task.update(data);
    } catch (error) {
      this.#checkTaskValidationError(error);
      throw error;
    }
  }

  async deleteTaskById(id, userId) {
    try {
      const task = await this.getTaskById(id, userId);
      await task.destroy();
    } catch (error) {
      throw error;
    }
  }

  async deleteCompletedTasks(userId) {
    try {
      return await this.deleteRecords({ userId, completed: true });
    } catch (error) {
      throw error;
    }
  }

  async deleteAllTasks(userId) {
    try {
      return await this.deleteRecords({ userId });
    } catch (error) {
      throw error;
    }
  }

  #checkTaskValidationError(error) {
    // check for userId when unit testing
    if (error instanceof ValidationError) {
      if (!error.errors || error.errors.length === 0) {
        throw new BadRequestError(
          "Please, check if all the fields are filled correctly!"
        );
      }

      const errorData = error.errors.pop();

      if (errorData.path === "description") {
        throw new BadRequestError(
          `The value "${errorData.value}" is not a valid description!`
        );
      }

      // if (errorData.path === "completed") {
      //   throw new BadRequestError(
      //     `The value "${errorData.value}" is not valid for the field "completed"!`
      //   );
      // }
    }
  }
}

module.exports = TaskServices;
