<template>
  <v-app>
    <AppBar
      ><template v-slot:title>Task Manager - Create Task</template></AppBar
    >
    <v-main class="container">
      <v-form @submit.prevent="createTask">
        <v-container class="form__container">
          <v-text-field
            class="input"
            label="Description"
            name="description"
            maxlength="75"
            v-model="description"
            variant="outlined"
            :rules="[required, size]"
            clearable
            required
          ></v-text-field>
        </v-container>

        <v-container class="form__buttons form__container">
          <v-btn
            variant="flat"
            size="large"
            color="green-darken-2"
            prepend-icon="mdi-checkbox-marked-circle-plus-outline"
            type="submit"
            class="button"
            >Create</v-btn
          >

          <router-link to="/tasks" class="link">
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
import AppBar from "@/components/AppBar.vue";
import { AlertTypes } from "@/interfaces/Alert";
import Task from "@/interfaces/Task";
import { useAlertStore } from "@/store/alerts";
import { useTaskStore } from "@/store/tasks";
import { useUserStore } from "@/store/user";
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "TaskForm",
  components: { AppBar },
  async setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const taskStore = useTaskStore();
    const alertStore = useAlertStore();

    const description = ref("");

    try {
      await userStore.authenticate();
    } catch (error) {
      let message = "An unexpected error has ocurred";

      if (error instanceof Error) message = error.message;

      alertStore.alert({ type: AlertTypes.ERROR, text: message });
      console.error(error);
      router.push("/login");
    }

    const required = (v: string): true | string => !!v || "Required!";

    const size = (v: string): true | string => {
      return v.length >= 3 ? true : "Min 3 characters!";
    };

    const createTask = async (): Promise<void> => {
      const task: Task = {
        description: description.value,
        completed: false,
        userId: userStore.user?.id,
      };

      await taskStore.createTask(task);
      alertStore.alert({
        type: AlertTypes.SUCCESS,
        text: "Task created successfully!",
      });
      router.push("/tasks");
    };

    return {
      description,
      required,
      size,
      createTask,
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