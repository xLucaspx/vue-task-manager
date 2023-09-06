<template>
  <v-app>
    <v-container class="container">
      <h1 class="title">Tasks</h1>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import { AlertTypes } from "@/interfaces/Alert";
import { useAlertStore } from "@/store/alerts";
import { useUserStore } from "@/store/user";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "TaskList",
  components: {},
  data() {
    return {};
  },
  async setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const alertStore = useAlertStore();

    try {
      await userStore.authenticate();
    } catch (error) {
      let message = "An unexpected error has ocurred";

      if (error instanceof Error) message = error.message;

      alertStore.alert({ type: AlertTypes.ERROR, text: message });
      console.error(error);
      router.push("/login");
    }

    return {};
  },
});
</script>

<style scoped></style>
