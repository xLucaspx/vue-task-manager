import Task from "@/interfaces/Task";
import Controller from "./Controller";

export default class TaskController extends Controller {
  constructor() {
    super("/tasks");
  }

  async getTasks(token: string): Promise<Task[]> {
    const res = await fetch(this.url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    if (res.ok) return data as Task[];

    throw new Error(data.error);
  }

  async getTaskById(id: Task["id"], token: string): Promise<Task> {
    const res = await fetch(`${this.url}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    if (res.ok) return data as Task;

    throw new Error(data.error);
  }

  async createTask(task: Task, token: string): Promise<void> {
    const res = await fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    });

    if (res.ok) return;

    const data: { error: string } = await res.json();
    throw new Error(data.error);
  }

  async updateTask(task: Task, token: string): Promise<void> {
    const res = await fetch(`${this.url}/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    });

    if (res.ok) return;

    const data: { error: string } = await res.json();
    throw new Error(data.error);
  }

  async toggleCompleted(
    id: Task["id"],
    completed: Task["completed"],
    token: string
  ): Promise<void> {
    const res = await fetch(`${this.url}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, completed }),
    });

    if (res.ok) return;

    const data: { error: string } = await res.json();
    throw new Error(data.error);
  }

  async deleteTask(id: Task["id"], token: string): Promise<void> {
    const res = await fetch(`${this.url}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) return;

    const data: { error: string } = await res.json();
    throw new Error(data.error);
  }

  async deleteCompletedTasks(token: string): Promise<void> {
    const res = await fetch(`${this.url}/completed`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) return;

    const data: { error: string } = await res.json();
    throw new Error(data.error);
  }

  async deleteAllTasks(token: string): Promise<void> {
    const res = await fetch(`${this.url}/all`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) return;

    const data: { error: string } = await res.json();
    throw new Error(data.error);
  }
}
