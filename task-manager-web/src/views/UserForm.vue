<template>
  <v-app>
    <AppBar><template v-slot:title>Task Manager</template></AppBar>
    <v-main class="container">
      <h1 class="title">Register</h1>
      <v-form @submit.prevent="createUser">
        <v-container class="form__container">
          <v-text-field
            class="input"
            label="Name"
            name="name"
            maxlength="75"
            v-model="name"
            variant="outlined"
            :rules="[required, nameMin]"
            clearable
            required
            autocomplete="name"
          ></v-text-field>

          <v-text-field
            class="input"
            label="E-mail"
            name="email"
            type="email"
            maxlength="50"
            v-model="email"
            variant="outlined"
            :rules="[required, isValidEmail]"
            clearable
            required
            autocomplete="email"
          ></v-text-field>

          <v-text-field
            class="input"
            label="Username"
            name="username"
            maxlength="20"
            v-model="username"
            variant="outlined"
            :rules="[required, isValidUsername]"
            clearable
            required
            autocomplete="username"
          ></v-text-field>

          <v-text-field
            class="input"
            label="Password"
            name="password"
            :type="show ? 'text' : 'password'"
            maxlength="50"
            v-model="password"
            variant="outlined"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show = !show"
            :rules="[required, isValidPassword]"
            clearable
            required
          ></v-text-field>
        </v-container>

        <v-container class="form__buttons form__container">
          <v-btn
            variant="flat"
            color="blue-darken-1"
            size="large"
            prepend-icon="mdi-account-plus-outline"
            type="submit"
            class="button"
            >Register</v-btn
          >

          <router-link to="/login" class="link">
            <v-btn
              variant="outlined"
              color="red-darken-4"
              size="large"
              prepend-icon="mdi-close-circle-outline"
              type="button"
              class="button"
              >Cancel
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
import User from "@/interfaces/User";
import UserController from "@/controller/UserController";
import { useAlertStore } from "@/store/alerts";
import { AlertTypes } from "@/interfaces/Alert";

export default defineComponent({
  name: "UserForm",
  components: { AppBar },
  data() {
    return { show: false };
  },
  setup() {
    const router = useRouter();
    const alertStore = useAlertStore();

    const name = ref("");
    const email = ref("");
    const username = ref("");
    const password = ref("");

    const required = (v: string): true | string => !!v || "Required!";

    const nameMin = (v: string): true | string => {
      return v.length >= 3 ? true : "Min 3 characters!";
    };

    const isValidEmail = (v: string): true | string => {
      return v.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/i)
        ? true
        : "Not a valid e-mail address!";
    };

    const isValidUsername = (v: string): true | string => {
      return v.match(/^[\w-]{3,20}$/i)
        ? true
        : "Only letters, numbers, hyphen and underscore; between 3 and 20 characters!";
    };

    const isValidPassword = (v: string): true | string => {
      return v.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*()_+\-={[}\]:;>.<,?/|\\])[A-Za-z\d!@#$%&*()_+\-={[}\]:;>.<,?/|\\]{8,}$/
      )
        ? true
        : "At least 8 characters, one uppercase letter, one lowercase letter, one number and one special character";
    };

    const createUser = async (): Promise<void> => {
      const user: User = {
        name: name.value,
        email: email.value,
        username: username.value,
        password: password.value,
      };

      await new UserController().createUser(user);
      alertStore.alert({
        type: AlertTypes.SUCCESS,
        text: "Registration completed successfully!",
      });
      router.push("/login");
    };

    return {
      name,
      email,
      username,
      password,
      required,
      nameMin,
      isValidEmail,
      isValidUsername,
      isValidPassword,
      createUser,
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
