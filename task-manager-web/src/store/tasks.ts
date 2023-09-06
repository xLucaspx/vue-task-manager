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

    async createTask(task: Task): Promise<void> {
      const token = getCookie("jwt");

      if (!token)
        throw new Error("Authentication is required to create tasks!");

      await taskController.createTask(task, token);
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
