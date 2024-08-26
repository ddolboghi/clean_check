import { Message } from "../Chatbot";

export default function BotMessage({ role, content }: Message) {
  return (
    <div>
      <div>피부상담사</div>
      <p>{content}</p>
    </div>
  );
}
