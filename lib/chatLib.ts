import { Message } from "@/components/chat/Chatbot";
import { NUMBER_OF_MAX_QUESTION } from "@/utils/constant";

export const getIsOverQuestion = (chat: Message[]) => {
  return chat.filter((c) => c.role !== "user").length > NUMBER_OF_MAX_QUESTION;
};
