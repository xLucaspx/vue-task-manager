import Login from "@/views/Login.vue";
import Tasks from "@/views/Tasks.vue";
import TaskList from "@/views/tasks/TaskList.vue";
import UserForm from "@/views/UserForm.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/tasks",
    name: "Tasks",
    component: Tasks,
    children: [
      {
        path: "",
        name: "Tasks",
        component: TaskList,
      },
    ],
  },
  {
    path: "/register",
    name: "Create account",
    component: UserForm,
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
