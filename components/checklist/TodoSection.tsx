import { Todo } from "@/utils/types";
import Image from "next/image";
import fillCheckBox from "@/public/assets/fillCheckbox.svg";
import emptyCheckBox from "@/public/assets/emptyCheckBox.svg";

type TodoSectionProps = {
  todoList: Todo[];
  clickedTopic: string;
  clickedDate: string;
  handleTodoClick: (clickedTodo: Todo) => Promise<void>;
};

export default function TodoSection({
  todoList,
  clickedTopic,
  clickedDate,
  handleTodoClick,
}: TodoSectionProps) {
  return (
    <section
      className={`px-6 bg-white flex flex-col gap-5 overflow-y-scroll scrollbar-hide`}
    >
      {todoList
        .filter(
          (btnTodo) => clickedTopic === "전체" || btnTodo.topic === clickedTopic
        )
        .map((btnTodo) => {
          const isCompleted = btnTodo.days[clickedDate];

          return (
            <button
              className={`flex justify-between items-center px-6 py-4 w-full rounded-3xl border-2 border-solid ${
                isCompleted
                  ? "bg-white bg-opacity-80 border-zinc-100 text-[#B2B2B2]"
                  : "bg-[#E1F5F1] border-[#E1F5F1] text-[#528A80]"
              }`}
              key={btnTodo.todoId}
              onClick={() => handleTodoClick(btnTodo)}
            >
              <p className="whitespace-normal mr-2 text-left">{btnTodo.todo}</p>
              <Image
                src={isCompleted ? fillCheckBox : emptyCheckBox}
                width={18}
                height={18}
                alt={isCompleted ? "완료" : "미완료"}
              />
            </button>
          );
        })}
    </section>
  );
}
