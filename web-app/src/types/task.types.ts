export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

export interface CreateTaskBody {
  title: string;
  description: string;
}

export interface UpdateTaskBody {
  id: number;
  status: string;
}
