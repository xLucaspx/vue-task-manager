import User from "@/interfaces/User";
import Controller from "./Controller";

export default class UserController extends Controller {
  constructor() {
    super("/user");
  }

  async getUserById(id: User["id"], token: string): Promise<User> {
    const res = await fetch(`${this.url}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    if (res.ok) return data as User;

    throw new Error(data.error);
  }

  async createUser(user: User): Promise<void> {
    const res = await fetch(this.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (res.ok) return;

    const data: { error: string } = await res.json();
    throw new Error(data.error);
  }

  async updateUser(user: User, token: string): Promise<void> {
    const res = await fetch(`${this.url}/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    });

    if (res.ok) return;

    const data: { error: string } = await res.json();
    throw new Error(data.error);
  }

  async userLogin(credentials: {
    user: User["username"] | User["email"];
    password: string;
  }): Promise<string> {
    const res = await fetch(`${this.url}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await res.json();

    if (res.ok) return data;

    throw new Error(data.error);
  }

  async authenticateUser(
    token: string
  ): Promise<{ name: User["name"]; id: User["id"] }> {
    const res = await fetch(`${this.url}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) return data;

    throw new Error(data.error);
  }

  async deleteUser(id: User["id"], token: string): Promise<void> {
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
}
