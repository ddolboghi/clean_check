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
