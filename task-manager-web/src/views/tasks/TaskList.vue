<template>
  <v-app>
    <AppBar><template v-slot:title>Task Manager - Your Tasks</template></AppBar>
    <v-main class="container">
      <v-card>
        <v-card-title>
          <div class="buttons">
            <div class="buttons__task">
              <RouterLink to="/tasks/new">
                <v-btn
                  variant="flat"
                  color="green-darken-2"
                  prepend-icon="mdi-checkbox-marked-circle-plus-outline"
                  type="button"
                  >New task
                </v-btn>
              </RouterLink>

              <v-btn
                variant="outlined"
                color="blue-darken-1"
                prepend-icon="mdi-checkbox-multiple-outline"
                type="button"
                @click="deleteCompleted"
                >Delete completed
              </v-btn>

              <v-btn
                variant="outlined"
                color="red-darken-4"
                prepend-icon="mdi-trash-can-outline"
                type="button"
                @click="deleteAll"
                >Delete all
              </v-btn>
            </div>

            <div class="buttons__user">
              <RouterLink to="/user/edit">
                <v-btn
                  variant="flat"
                  color="blue-darken-1"
                  prepend-icon="mdi-account-edit-outline"
                  type="button"
                  >Account
                </v-btn>
              </RouterLink>

              <v-btn
                variant="flat"
                color="red-darken-4"
                prepend-icon="mdi-logout-variant"
                type="button"
                @click="logout"
                >Logout
              </v-btn>
            </div>
          </div>
        </v-card-title>

        <v-table>
          <thead>
            <tr>
              <th>Description</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="task in tasks" :key="task.id">
              <td>{{ task.description }}</td>
              <td class="table__buttons">
                <v-btn
                  :variant="task.completed ? 'outlined' : 'flat'"
                  color="green-darken-2"
                  prepend-icon="mdi-check-outline"
                  size="small"
                  type="button"
                  :title="
                    task.completed
                      ? 'Mark as not completed'
                      : 'Mark as completed'
                  "
                  >{{ task.completed ? "Not completed" : "Completed" }}
                </v-btn>

                <RouterLink
                  :to="`/tasks/${task.id}`"
                  class="link"
                  title="Edit task"
                >
                  <v-btn
                    variant="flat"
                    color="blue-darken-1"
                    prepend-icon="mdi-pencil-outline"
                    size="small"
                    type="button"
                    >Edit
                  </v-btn>
                </RouterLink>

                <v-btn
                  variant="flat"
                  color="red-darken-4"
                  prepend-icon="mdi-delete-forever-outline"
                  size="small"
                  title="Delete task"
                  @click="deleteTask(task.id)"
                  >Delete
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRouter } from "vue-router";
import AppBar from "@/components/AppBar.vue";
import { AlertTypes } from "@/interfaces/Alert";
import { useAlertStore } from "@/store/alerts";
import { useTaskStore } from "@/store/tasks";
import { useUserStore } from "@/store/user";
import Task from "@/interfaces/Task";

export default defineComponent({
  name: "TaskList",
  components: { AppBar },
  async setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const taskStore = useTaskStore();
    const alertStore = useAlertStore();

    try {
      await userStore.authenticate();
      await taskStore.getTasks();
    } catch (error) {
      let message = "An unexpected error has ocurred";

      if (error instanceof Error) message = error.message;

      alertStore.alert({ type: AlertTypes.ERROR, text: message });
      console.error(error);
      router.push("/login");
    }

    const tasks = computed(() => taskStore.tasks);

    const deleteTask = async (id: Task["id"]): Promise<void> => {
      try {
        await taskStore.deleteById(id);
        alertStore.alert({
          type: AlertTypes.SUCCESS,
          text: "The selected task was deleted!",
        });
      } catch (error) {
        let message = "An unexpected error has ocurred";

        if (error instanceof Error) message = error.message;

        alertStore.alert({ type: AlertTypes.ERROR, text: message });
        console.error(error);
      }
    };

    const deleteCompleted = async (): Promise<void> => {
      try {
        await taskStore.deleteCompleted();
        alertStore.alert({
          type: AlertTypes.SUCCESS,
          text: "All completed tasks were deleted!",
        });
      } catch (error) {
        let message = "An unexpected error has ocurred";

        if (error instanceof Error) message = error.message;

        alertStore.alert({ type: AlertTypes.ERROR, text: message });
        console.error(error);
      }
    };

    const deleteAll = async (): Promise<void> => {
      try {
        await taskStore.deleteAll();
        alertStore.alert({
          type: AlertTypes.SUCCESS,
          text: "All tasks were deleted!",
        });
      } catch (error) {
        let message = "An unexpected error has ocurred";

        if (error instanceof Error) message = error.message;

        alertStore.alert({ type: AlertTypes.ERROR, text: message });
        console.error(error);
      }
    };

    const logout = (): void => {
      userStore.logout();
      router.push("/login");
    };

    return {
      tasks,
      logout,
      deleteTask,
      deleteCompleted,
      deleteAll,
    };
  },
});
</script>

<style scoped>
.container {
  padding: 5rem 3rem;
}

.buttons,
.buttons__task,
.buttons__user,
.table__buttons {
  display: flex;
  gap: 15px;
}

.buttons {
  justify-content: space-between;
}

.table__buttons {
  justify-content: flex-end;
  align-items: center;
}
</style>
