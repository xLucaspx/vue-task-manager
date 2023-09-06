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
              <td class="text-center">
                Actions
                <!-- # Edit button
                <RouterLink
                  :to="`/students/${student.id}`"
                  class="link"
                  :title="'Edit ' + student.name"
                >
                  <v-btn
                    variant="outlined"
                    prepend-icon="mdi-pencil-outline"
                    size="small"
                    class="table__button"
                    >Edit
                  </v-btn>
                </RouterLink>

                # Delete dialog button
                <v-btn
                  color="error"
                  variant="flat"
                  prepend-icon="mdi-delete-forever-outline"
                  size="small"
                  class="table__button"
                  :title="'Delete ' + student.name"
                  @click="selectStudent(student)"
                  >Delete

                  # Delete dialog
                  <v-dialog
                    v-model="dialog"
                    activator="parent"
                    transition="dialog-top-transition"
                  >
                    <v-card class="delete-dialog">
                      <v-card-text
                        >Do you wish do permanently delete the student
                        {{ selectedStudent.name }} under the ID
                        {{ selectedStudent.id }}?
                      </v-card-text>
                      <v-card-actions class="delete-dialog__buttons">

                        # Delete button
                        <v-btn
                          color="error"
                          variant="flat"
                          prepend-icon="mdi-delete-forever-outline"
                          @click="deleteStudent(selectedStudent.id)"
                          >Delete</v-btn
                        >

                        <v-btn
                          color="indigo darken-4"
                          variant="outlined"
                          prepend-icon="mdi-cancel"
                          @click="dialog = false"
                          >Cancel</v-btn
                        >
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-btn> -->
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

export default defineComponent({
  name: "TaskList",
  components: { AppBar },
  data() {
    return {};
  },
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

    const deleteCompleted = async (): Promise<void> => {
      await taskStore.deleteCompleted();
    };

    const deleteAll = async (): Promise<void> => {
      await taskStore.deleteAll();
    };

    const logout = (): void => {
      userStore.logout();
      router.push("/login");
    };

    return {
      tasks,
      logout,
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
.buttons__user {
  display: flex;
  gap: 15px;
}

.buttons {
  justify-content: space-between;
}
</style>
