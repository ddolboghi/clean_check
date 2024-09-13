import { ChatGptMessage } from "@/utils/types";

export const getIsOverQuestion = (chat: ChatGptMessage[]) => {
  const numberOfMaxQuestion = Number(
    process.env.NEXT_PUBLIC_NUMBER_OF_MAX_QUESTION as string
  );
  return (
    chat.filter((c) => c.role === "assistant").length > numberOfMaxQuestion
  );
};

export const getNumberOfBotQuestions = (chat: ChatGptMessage[]) => {
  return chat.filter((c) => c.role !== "user").length;
};

export const chatGptMessagesConvertor = (chatGptMessages: ChatGptMessage[]) => {
  const consultation = chatGptMessages
    .map((chat) =>
      chat.role === "user"
        ? `Patient: ${chat.content}`
        : `Dermatologist: ${chat.content}`
    )
    .join("\n");
  return consultation;
};
