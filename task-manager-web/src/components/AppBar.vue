<template>
  <v-app-bar :elevation="3" class="app-bar">
    <v-app-bar-title>
      <slot name="title"></slot>
    </v-app-bar-title>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({ name: "AppBar" });
</script>

<style scoped>
.app-bar {
  text-align: center;
}
</style>
