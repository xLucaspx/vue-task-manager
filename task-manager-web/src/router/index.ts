import Login from "@/views/Login.vue";
import Tasks from "@/views/Tasks.vue";
import User from "@/views/User.vue";
import TaskList from "@/views/tasks/TaskList.vue";
import TaskForm from "@/views/tasks/TaskForm.vue";
import UserForm from "@/views/user/UserForm.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/tasks",
    component: Tasks,
    children: [
      {
        path: "",
        name: "Tasks",
        component: TaskList,
      },
      {
        path: "new",
        name: "Create task",
        component: TaskForm,
      },
    ],
  },
  {
    path: "/user",
    name: "User",
    component: User,
    children: [
      {
        path: "edit",
        name: "Edit user",
        component: UserForm,
      },
      {
        path: "register",
        name: "Create account",
        component: UserForm,
      },
    ],
  },
  {
    path: "/login",
    name: "Sign in",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
