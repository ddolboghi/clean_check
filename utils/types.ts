export type MainRoutine = {
  id: number;
  content: string;
};

export interface Folder {
  id: number;
  name: string;
  numberOfRoutines: number;
}

export interface FolderWithRoutines extends Folder {
  routines: MainRoutine[];
}

export type ScheduledNotification = {
  id: string;
  member_id: string;
  notification_time: string;
  title: string;
  body: string;
  is_sent: boolean;
  repeat_option: string;
  path: string;
  other_id: number;
};

export type FCMToken = {
  member_Id: string;
  token: string;
  user_agent: string;
};

export type RepeatOption = "daily" | "weekly" | null;
