export type Todo = {
  timeOrder: number;
  todoId: number;
  todo: string;
  days: { [key: string]: boolean };
};
