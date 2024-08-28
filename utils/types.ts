export type Todo = {
  topic: string;
  todoId: number;
  todo: string;
  days: { [key: string]: boolean };
};
