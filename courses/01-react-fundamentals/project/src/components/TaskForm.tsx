import { useState } from "react";
import type { Task } from "./TaskList";
import Button from "./Button";
import FormInput from "./FormInput";
interface TaskFormProps {
  onAddTask?: (task: Task) => void;
}

export default function TaskForm(_props: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Low");
  const [error, setError] = useState("");
  const [category, setCategory] = useState("General");
  const [tags, setTags] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setError("");

    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      priority,
      completed: false,
      category,
      tags: parsedTags,
      dueDate: dueDate || undefined,
    };

    _props.onAddTask?.(newTask);

    setTitle("");
    setDescription("");
    setPriority("Low");
    setCategory("General");
    setTags("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="task-title">Title</label>
       <FormInput
  label="Title"
  id="task-title"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  error={error}
/>
<p id="task-form-error">{error}</p>
      </div>

      <div>
        <label htmlFor="task-description">Description</label>
       <FormInput
  label="Description"
  id="task-description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  textarea
/>
      </div>

      <div>
        <label htmlFor="task-priority">Priority</label>
        <select
          id="task-priority"
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value as "Low" | "Medium" | "High")
          }
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

          

     <Button type="submit" variant="primary">
  Add Task
</Button>

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="General">General</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
      </select>

      <input
        type="text"
        placeholder="Tags (comma Seperated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <label>
        Due Date
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </label>
    </form>
  );
}
