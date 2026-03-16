import React, { FC } from "react";
import { Task } from "../types/task.types";

interface TaskItemProps {
  task: Task;
  completeTask: (id: number) => void;
}

const TaskItem: FC<TaskItemProps> = ({ task, completeTask }) => {
  return (
    <div className="task-card">
      <div>
        <h3>{task.title}</h3>
        <p>{task.description}</p>
      </div>

      <button className="done-btn" onClick={() => completeTask(task.id)}>
        Done
      </button>
    </div>
  );
};

export default TaskItem;
