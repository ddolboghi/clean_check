import { Message } from "@/components/chat/Chatbot";

export const getIsOverQuestion = (chat: Message[]) => {
  const numberOfMaxQuestion = Number(
    process.env.NEXT_PUBLIC_NUMBER_OF_MAX_QUESTION as string
  );
  return (
    chat.filter((c) => c.role === "assistant").length > numberOfMaxQuestion
  );
};

export const getNumberOfBotQuestions = (chat: Message[]) => {
  return chat.filter((c) => c.role !== "user").length;
};
