export enum TaskStatus {
  PENDING = "pending",
  DONE = "done",
}

export interface CreateTaskType {
  title: string;
  description: string;
}

export interface UpdateTaskType {
  id: string;
  status: string;
}
