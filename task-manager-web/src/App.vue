<template>
  <NotificationAlert></NotificationAlert>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NotificationAlert from "@/components/NotificationAlert.vue";

export default defineComponent({
  name: "App",
  components: { NotificationAlert },
});
</script>
