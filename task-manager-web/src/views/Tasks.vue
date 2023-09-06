<template>
  <Suspense>
    <router-view></router-view>

    <template #fallback>Loading...</template>
  </Suspense>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({ name: "Tasks" });
</script>
