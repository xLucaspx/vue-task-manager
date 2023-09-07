<template>
  <v-app>
    <AppBar
      ><template v-slot:title>{{ appBarTitle }}</template></AppBar
    >
    <v-main class="container">
      <h1 class="title">{{ title }}</h1>
      <v-form @submit.prevent="saveUser">
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
            :persistent-hint="id ? true : false"
            :hint="
              id
                ? 'This field is only required if you want to change your password'
                : 'At least 8 characters, one uppercase letter, one lowercase letter, one number and one special character'
            "
            :rules="[isValidPassword, id ? '' : required]"
            clearable
            :required="id ? false : true"
          ></v-text-field>
        </v-container>

        <v-container class="form__buttons form__container">
          <v-btn
            variant="flat"
            color="blue-darken-1"
            size="large"
            :prepend-icon="
              id ? 'mdi-content-save-edit-outline' : 'mdi-account-plus-outline'
            "
            type="submit"
            class="button"
            >{{ saveButtonText }}</v-btn
          >

          <router-link :to="cancelLink" class="link">
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
import { useUserStore } from "@/store/user";

export default defineComponent({
  name: "UserForm",
  components: { AppBar },
  data() {
    return { show: false };
  },
  async setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const alertStore = useAlertStore();

    const name = ref("");
    const email = ref("");
    const username = ref("");
    const password = ref("");
    let id: User["id"];
    let saveUser;
    let appBarTitle = "Task Manager - Update Account";
    let title = "User information";
    let saveButtonText = "Save changes";
    let cancelLink = "/tasks";

    try {
      await userStore.authenticate();
      const user = userStore.user;

      id = user?.id;
      name.value = user?.name || "";
      email.value = user?.email || "";
      username.value = user?.username || ";";

      saveUser = async (): Promise<void> => {
        const user: User = {
          id: id,
          name: name.value,
          email: email.value,
          username: username.value,
          password: password.value,
        };
        try {
          await userStore.update(user);
          alertStore.alert({
            type: AlertTypes.SUCCESS,
            text: "Editing successful, your information has been saved!",
          });
          router.push("/tasks");
        } catch (error) {
          let message =
            "An unexpected error has occurred when trying to create your account!";

          if (error instanceof Error) message = error.message;

          alertStore.alert({
            type: AlertTypes.ERROR,
            text: message,
          });
        }
      };
    } catch (error) {
      appBarTitle = "Task Manager - Create Account";
      title = "Register";
      saveButtonText = "Create account";
      cancelLink = "/login";

      saveUser = async (): Promise<void> => {
        const user: User = {
          name: name.value,
          email: email.value,
          username: username.value,
          password: password.value,
        };

        try {
          await new UserController().createUser(user);
          alertStore.alert({
            type: AlertTypes.SUCCESS,
            text: "Registration completed successfully!",
          });
          router.push("/login");
        } catch (error) {
          let message =
            "An unexpected error has occurred when trying to create your account!";

          if (error instanceof Error) message = error.message;

          alertStore.alert({
            type: AlertTypes.ERROR,
            text: message,
          });
        }
      };
    }

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

    return {
      name,
      email,
      username,
      password,
      id,
      title,
      appBarTitle,
      saveButtonText,
      cancelLink,
      required,
      nameMin,
      isValidEmail,
      isValidUsername,
      isValidPassword,
      saveUser,
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
