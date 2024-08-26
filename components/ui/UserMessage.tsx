import { createClient } from "@/utils/supabase/client";
import { Message } from "../Chatbot";

export default function UserMessage({ role, content }: Message) {
  return (
    <div>
      <p>{content}</p>
    </div>
  );
}
