<template>
  <v-app>
    <AppBar><template v-slot:title>Task Manager</template></AppBar>
    <v-main class="container">
      <h1 class="title">Login</h1>
      <v-form @submit.prevent="login">
        <v-container class="form__container">
          <v-text-field
            class="input"
            label="E-mail or username"
            v-model="user"
            variant="outlined"
            :rules="[required]"
            clearable
            required
          ></v-text-field>

          <v-text-field
            class="input"
            label="Password"
            v-model="password"
            :type="show ? 'text' : 'password'"
            variant="outlined"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show = !show"
            :rules="[required]"
            clearable
            required
          ></v-text-field>
        </v-container>

        <v-container class="form__buttons form__container">
          <v-btn
            variant="flat"
            color="green-darken-2"
            size="large"
            prepend-icon="mdi-login-variant"
            type="submit"
            class="button"
            >Login</v-btn
          >

          <router-link to="/register" class="link">
            <v-btn
              variant="outlined"
              color="blue-darken-1"
              size="large"
              prepend-icon="mdi-account-plus-outline"
              type="button"
              class="button"
              >Register
            </v-btn>
          </router-link>
        </v-container>
      </v-form>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import AppBar from "@/components/AppBar.vue";
import { AlertTypes } from "@/interfaces/Alert";
import { useAlertStore } from "@/store/alerts";
import { useUserStore } from "@/store/user";
import { getCookie } from "@/utils/cookies";

export default defineComponent({
  name: "Login",
  components: { AppBar },
  data() {
    return { show: false };
  },
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const alertStore = useAlertStore();

    if (getCookie("jwt")) router.push("/tasks");

    const user = ref("");
    const password = ref("");

    const required = (v: string): true | string => !!v || "Required!";

    const login = async () => {
      try {
        await userStore.login(user.value, password.value);
        router.push("/tasks");
      } catch (error) {
        let message = "An unexpected error has ocurred";

        if (error instanceof Error) message = error.message;

        alertStore.alert({ type: AlertTypes.ERROR, text: message });
        console.error(error);
      } finally {
        password.value = "";
      }
    };

    return {
      user,
      password,
      required,
      login,
    };
  },
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 5rem 10rem;
}

.form__container {
  width: 475px;
}

.form__buttons {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.input {
  margin-bottom: 15px;
}

.button {
  width: 100%;
  height: 40px;
}
</style>
