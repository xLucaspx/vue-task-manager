import Home from "@/views/Home.vue";
import UserForm from "@/views/UserForm.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: Home,
    children: [
      {
        path: "",
        name: "Home",
        component: Home,
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
    component: Home, //*
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
