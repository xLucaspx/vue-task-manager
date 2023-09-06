import { Alert } from "@/interfaces/Alert";
import { defineStore } from "pinia";

interface AlertState {
  alerts: Alert[];
}

export const useAlertStore = defineStore({
  id: "alerts",
  state: (): AlertState => ({
    alerts: [],
  }),
  actions: {
    alert(alert: Alert) {
      alert.id = new Date().getTime();
      this.alerts.push(alert);

      console.log(this.alerts);

      setTimeout(() => this.removeAlert(alert.id), 3750);
    },

    removeAlert(id: Alert["id"]) {
      this.alerts = this.alerts.filter((a: Alert) => a.id !== id);
    },
  },
});
