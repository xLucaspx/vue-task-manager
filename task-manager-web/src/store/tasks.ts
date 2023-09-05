import TaskController from "@/controller/TaskController";
import Task from "@/interfaces/Task";
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
    // async getTasks() {
    //   const tasks = await taskController.getTasks();
    // }
  },
});
