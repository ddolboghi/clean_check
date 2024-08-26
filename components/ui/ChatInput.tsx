import { FormEvent } from "react";

type ChatProps = {
  userMessage: string;
  setUserMessage: (value: string) => void;
  handleSendMessage: (e: FormEvent) => void;
  disableChatInput: boolean;
};

export default function ChatInput({
  userMessage,
  setUserMessage,
  handleSendMessage,
  disableChatInput,
}: ChatProps) {
  return (
    <form onSubmit={handleSendMessage}>
      <input
        type="text"
        value={userMessage}
        onChange={(e) => {
          if (e.target.value.length <= 500) {
            setUserMessage(e.target.value);
          }
        }}
        placeholder="메시지를 입력해주세요."
        maxLength={500}
        disabled={disableChatInput}
      />
      <button type="submit">Send</button>
      <span>{userMessage.length}/500자</span>
    </form>
  );
}
