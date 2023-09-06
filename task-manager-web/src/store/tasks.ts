import TaskController from "@/controller/TaskController";
import Task from "@/interfaces/Task";
import { getCookie } from "@/utils/cookies";
import { defineStore } from "pinia";

interface TaskState {
  tasks: Task[];
}

const taskController = new TaskController();

export const useTaskStore = defineStore({
  id: "tasks",
  state: (): TaskState => ({
    tasks: [],
  }),
  actions: {
    async getTasks(): Promise<void> {
      const token = getCookie("jwt");

      if (!token) throw new Error("Authentication is required to fetch tasks!");

      const tasks = await taskController.getTasks(token);
      this.tasks = tasks;
    },

    getById(id: Task["id"]): Task {
      const task = this.tasks.find((t: Task) => t.id == id);

      if (task) return task;

      throw new Error("Task not found!");
    },

    async create(task: Task): Promise<void> {
      const token = getCookie("jwt");

      if (!token)
        throw new Error("Authentication is required to create tasks!");

      await taskController.createTask(task, token);
      await this.getTasks();
    },

    async update(task: Task): Promise<void> {
      const token = getCookie("jwt");

      if (!token) throw new Error("Authentication is required to edit tasks!");

      await taskController.updateTask(task, token);
      await this.getTasks();
    },

    async toggleCompleted(
      id: Task["id"],
      completed: Task["completed"]
    ): Promise<void> {
      const token = getCookie("jwt");

      if (!token) throw new Error("Authentication is required to edit tasks!");

      await taskController.toggleCompleted(id, completed, token);
      await this.getTasks();
    },

    async deleteById(id: Task["id"]) {
      const token = getCookie("jwt");

      if (!token)
        throw new Error("Authentication is required to delete tasks!");

      await taskController.deleteTask(id, token);
      await this.getTasks();
    },

    async deleteCompleted(): Promise<void> {
      const token = getCookie("jwt");

      if (!token)
        throw new Error("Authentication is required to delete tasks!");

      await taskController.deleteCompletedTasks(token);
      await this.getTasks();
    },

    async deleteAll(): Promise<void> {
      const token = getCookie("jwt");

      if (!token)
        throw new Error("Authentication is required to delete tasks!");

      await taskController.deleteAllTasks(token);
      await this.getTasks();
    },
  },
});
