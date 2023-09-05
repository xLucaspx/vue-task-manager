export default interface Task {
  id: number | string;
  description: string;
  completed: boolean;
  userId: number;
}
