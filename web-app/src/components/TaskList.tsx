import React, { FC } from "react";
import TaskItem from "./TaskItem";
import { Task } from "../types/task.types";

interface TaskListProps {
  tasks: Task[];
  completeTask: (id: number) => void;
}

const TaskList: FC<TaskListProps> = ({ tasks, completeTask }) => {
  return (
    <div className="task-list">
      {tasks.length !== 0 ? (
        tasks.map((task) => (
          <TaskItem key={task.id} task={task} completeTask={completeTask} />
        ))
      ) : (
        <p>No tasks available</p>
      )}
    </div>
  );
};

export default TaskList;
