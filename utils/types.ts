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
  path: string;
  other_id: number;
  is_deleted: boolean;
};

export type FCMToken = {
  member_Id: string;
  token: string;
  user_agent: string;
};
