import { Todo } from "@/utils/types";

export const getUniqueTopic = (todoList: Todo[]) => {
  const uniqueTopics = Array.from(new Set(todoList.map((todo) => todo.topic)));
  const newTopicList = ["전체", ...uniqueTopics];
  return newTopicList;
};
