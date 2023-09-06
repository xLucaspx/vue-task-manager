import User from "./User";

export default interface Task {
  id?: number | string;
  description: string;
  completed?: boolean;
  userId?: User["id"];
}
