export interface Task {
  id: string;
  title: string;
  descrypion: string;
  status: TaskStatus;
}

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DOME = 'DOME',
}
