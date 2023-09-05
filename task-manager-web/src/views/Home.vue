<template>
  <v-app>
    <v-sheet width="475" class="mx-auto">
      <h1 class="title">Login</h1>
      <v-form>
        <!--@submit.prevent="login"-->
        <v-text-field
          label="E-mail or username"
          v-model="user"
          variant="outlined"
          :rules="[required, userMin]"
          clearable
          required
        ></v-text-field>

        <v-text-field
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
      </v-form>
    </v-sheet>
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
