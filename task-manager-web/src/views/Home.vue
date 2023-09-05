<template>
  <v-app>
    <v-container class="container">
      <h1 class="title">Login</h1>
      <v-form
        ><!--@submit.prevent="login"-->
        <v-container class="form__container">
          <v-text-field
            class="input"
            label="E-mail or username"
            v-model="user"
            variant="outlined"
            :rules="[required, userMin]"
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
            :rules="[required, passwordMin]"
            clearable
            required
          ></v-text-field>
        </v-container>

        <v-container class="form__buttons form__container">
          <v-btn
            variant="flat"
            color="blue-darken-1"
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
    </v-container>
  </v-app>
</template>

<script lang="ts">
export default {
  data() {
    return {
      show: false,
      password: "",
      user: "",
      required: (value: string) => !!value || "Required",
      passwordMin: (v: string) => v.length >= 8 || "Min 8 characters",
      userMin: (v: string) => v.length >= 3 || "Min 3 characters",
    };
  },
};
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
