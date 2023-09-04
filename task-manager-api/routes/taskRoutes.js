const Router = require("express");
const TaskController = require("../controller/TaskController");

const router = Router();

router
  .get("/tasks", TaskController.getUserTasks)
  .get("/tasks/:id", TaskController.getTaskById)
  .post("/tasks", TaskController.createTask)
  // .put("/tasks/:id")
  .delete("/tasks/all", TaskController.deleteAllUserTasks)
  .delete("/tasks/completed", TaskController.deleteUserCompletedTasks)
  .delete("/tasks/:id", TaskController.deleteTaskById);

module.exports = router;
