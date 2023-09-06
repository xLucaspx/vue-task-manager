<template>
  <div class="alert" v-for="alert in alerts" :key="alert.id">
    <v-alert
      border="start"
      density="compact"
      variant="elevated"
      :type="alert.type"
      closable
    >
      {{ alert.text }}
    </v-alert>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useAlertStore } from "@/store/alerts";

export default defineComponent({
  name: "NotificationAlert",
  setup() {
    const alertStore = useAlertStore();
    const alerts = computed(() => alertStore.alerts);

    return { alerts };
  },
});
</script>

<style scoped>
.alert {
  position: fixed;
  right: 1rem;
  top: 4.5rem;
  z-index: 1;
  width: 450px;
}
</style>
