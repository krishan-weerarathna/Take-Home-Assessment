import React, { useState } from "react";
import "./App.css";
import TaskForm from "./components/TaskFrom";
import TaskList from "./components/TaskList";

import { useCreateTask, useGetAllTasks, useUpdateStatusTask } from "./api/task";

import Toast from "./components/Toast";
import { CreateTaskBody } from "./types/task.types";

function App() {
  const [toast, setToast] = useState({
    message: "",
    type: "",
  });

  const showToast = (message: string, type = "success") => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast({ message: "", type: "" });
  };

  const { data, refetch } = useGetAllTasks();

  const handleSuccess = () => {
    showToast("Task created successfully");
    refetch();
  };

  const handleUpdateSuccess = () => {
    showToast("Task status updated successfully");
    refetch();
  };

  const { mutate: taskCreateMutate } = useCreateTask({
    onSuccess: handleSuccess,
  });

  const { mutate: updateTaskMutate } = useUpdateStatusTask({
    onSuccess: handleUpdateSuccess,
  });

  const addTask = (task: CreateTaskBody) => {
    taskCreateMutate(task);
  };

  const completeTask = (id: number) => {
    updateTaskMutate({ id, status: "done" });
  };

  return (
    <div className="container">
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      <div className="left">
        <TaskForm addTask={addTask} />
      </div>

      <div className="divider"></div>

      <div className="right">
        <TaskList tasks={data || []} completeTask={completeTask} />
      </div>
    </div>
  );
}

export default App;
