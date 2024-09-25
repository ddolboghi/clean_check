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
