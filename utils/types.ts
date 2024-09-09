export type Todo = {
  topic: string;
  todoId: number;
  todo: string;
  days: { [key: string]: boolean };
};

export type PushSubscriptionType = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  expirationTime: null;
};

export type PushNofiticationType = {
  id: number;
  push_subscription: PushSubscriptionType;
  member_id: string;
}[];

export type RequestDataType = {
  memberId: string;
  pushSubscription: PushSubscriptionType;
};

export type ChatGptMessage = {
  content: string;
  role: "user" | "assistant" | "system" | "final";
};

export type GeneratingCheckListType = {
  disableChatInput: boolean;
  generateAnalyzeConversations: boolean;
  generateTodoListMessage: boolean;
  generateParsedTodoList: boolean;
  saveCheckList: boolean;
  savedCheckListSuccess: boolean;
};

export type ParsedCheckList =
  | {
      todoId: number;
      topic: string;
      todo: string;
      dayNum: number;
    }[]
  | null;
