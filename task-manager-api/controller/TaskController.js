const { BadRequestError, UnauthorizedError } = require("../errors");
const TaskServices = require("../services/TaskServices");
const { verifyJwt } = require("../utils/jwt");

const taskServices = new TaskServices();

class TaskController {
  static async getUserTasks(req, res) {
    try {
      const token = verifyJwt(req.headers.authorization);

      const tasks = await taskServices.getUserTasks(token.id);
      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  static async getTaskById(req, res) {
    const { id } = req.params;

    try {
      const token = verifyJwt(req.headers.authorization);

      const task = await taskServices.getTaskById(id, token.id);
      return res.status(200).json(task);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  static async createTask(req, res) {
    const task = req.body;

    try {
      const token = verifyJwt(req.headers.authorization);

      if (!task.userId) {
        throw new BadRequestError(
          "It's not possible to create a new task without the user's ID!"
        );
      }
      if (task.userId != token.id) {
        throw new UnauthorizedError(
          "It's not possible to create a task for other users!"
        );
      }

      const createdTask = await taskServices.createTask(task);
      return res.status(201).json(createdTask);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  // static async updateUser(req, res) {
  //   const { id } = req.params;
  //   const data = req.body;

  //   try {
  //     const token = verifyJwt(req.headers.authorization);

  //     if (id != token.id) {
  //       throw new UnauthorizedError(
  //         "It's not possible to modify other users' information!"
  //       );
  //     }

  //     if (data.password) {
  //       const { hash, salt } = generateHashAndSalt(data.password);
  //       data.passwordHash = hash;
  //       data.salt = salt;
  //       delete data.password;
  //     }

  //     const user = await taskServices.updateUser(id, data);
  //     return res.status(200).json(user);
  //   } catch (error) {
  //     return res.status(error.status || 500).json({ error: error.message });
  //   }
  // }

  static async deleteTaskById(req, res) {
    const { id } = req.params;

    try {
      const token = verifyJwt(req.headers.authorization);

      await taskServices.deleteTaskById(id, token.id);
      return res.status(204).json({});
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  static async deleteUserCompletedTasks(req, res) {
    try {
      const token = verifyJwt(req.headers.authorization);

      const deletedTotal = await taskServices.deleteCompletedTasks(token.id);
      return res.status(200).json(deletedTotal);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }

  static async deleteAllUserTasks(req, res) {
    try {
      const token = verifyJwt(req.headers.authorization);

      const deletedTotal = await taskServices.deleteAllTasks(token.id);
      return res.status(200).json(deletedTotal);
    } catch (error) {
      return res.status(error.status || 500).json({ error: error.message });
    }
  }
}

module.exports = TaskController;
