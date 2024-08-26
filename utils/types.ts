export type Todo = {
  topic: string;
  todoId: number;
  todo: string;
  days: number[];
};

export type Completion = {
  todoId: number;
  complete: {
    [key: string]: boolean;
  };
};
