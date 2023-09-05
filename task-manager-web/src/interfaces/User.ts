import Task from "./Task";

export default interface User {
  id?: number | string;
  name: string;
  email: string;
  username: string;
  password?: string;
  tasks?: Task[];
}
