import UserController from "@/controller/UserController";
import User from "@/interfaces/User";
import { defineCookie, getCookie, removeCookie } from "@/utils/cookies";
import { defineStore } from "pinia";

interface UserState {
  user: User | null;
}

const userController = new UserController();

export const useUserStore = defineStore({
  id: "user",
  state: (): UserState => ({ user: null }),
  actions: {
    async login(
      user: User["username"] | User["email"],
      password: string
    ): Promise<void> {
      const token: string = await userController.userLogin({ user, password });
      defineCookie("jwt", token);
      return;
    },

    async authenticate(): Promise<void> {
      const token = getCookie("jwt");

      if (!token) throw new Error("Login is required to authenticate!");

      const { id } = await userController.authenticateUser(token);
      this.user = await userController.getUserById(id, token);
    },

    logout(): void {
      this.user = null;
      removeCookie("jwt");
    },

    async update(user: User): Promise<void> {
      const token = getCookie("jwt");

      if (!token)
        throw new Error("Authentication is required to update account!");

      await userController.updateUser(user, token);
      await this.authenticate();
    },

    async delete(): Promise<void> {
      const token = getCookie("jwt");

      if (!this.user || !token)
        throw new Error("Authentication is required to delete account!");

      await userController.deleteUser(this.user.id, token);
      this.logout();
    },
  },
});
