import UserController from "@/controller/UserController";
import User from "@/interfaces/User";
import { defineStore } from "pinia";

interface UserState {
  user: User | null;
  token: string | null;
}

const userController = new UserController();

export const useUserStore = defineStore({
  id: "user",
  state: (): UserState => ({ user: null, token: null }),
  actions: {
    async login(
      user: User["username"] | User["email"],
      password: string
    ): Promise<void> {
      const token: string = await userController.userLogin({ user, password });
      this.token = token;
      return;
    },

    async authenticate(): Promise<void> {
      if (!this.token) throw new Error("Login is required to authenticate!");

      const { id } = await userController.authenticateUser(this.token);
      this.user = await userController.getUserById(id, this.token);
    },

    logout(): void {
      this.user = null;
      this.token = null;
    },

    async update(user: User): Promise<void> {
      if (!this.token)
        throw new Error("Authentication is required to update account!");

      await userController.updateUser(user, this.token);
      await this.authenticate();
    },

    async delete(): Promise<void> {
      if (!this.user || !this.token)
        throw new Error("Authentication is required to delete account!");

      await userController.deleteUser(this.user.id, this.token);
      this.logout();
    },
  },
});
