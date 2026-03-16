import React, { FC, useState } from "react";
import { CreateTaskBody } from "../types/task.types";

interface TaskFormProps {
  addTask: (task: CreateTaskBody) => void;
}

interface FormErrors {
  title?: string;
  description?: string;
}

const TaskFrom: FC<TaskFormProps> = ({ addTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});

  const submitHandler = (e: any) => {
    e.preventDefault();

    let newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);

    // if errors exist stop submission
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    addTask({ title, description });

    setTitle("");
    setDescription("");
  };

  return (
    <form className="task-form" onSubmit={submitHandler}>
      <h2>Add a Task</h2>
      <div className="input-group">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <p className="error">{errors.title}</p>}
      </div>

      <div className="input-group">
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && <p className="error">{errors.description}</p>}
      </div>

      <button type="submit">Add</button>
    </form>
  );
};

export default TaskFrom;
