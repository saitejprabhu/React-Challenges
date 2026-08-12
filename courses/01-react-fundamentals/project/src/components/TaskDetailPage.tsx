import { useNavigate, useParams } from "react-router-dom";
import type { Task } from "./TaskList";

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const savedTasks = localStorage.getItem("task-app-tasks");

  let tasks: Task[] = [];

  try {
    if (savedTasks) {
      tasks = JSON.parse(savedTasks) as Task[];
    }
  } catch {
    tasks = [];
  }

  const task = tasks.find((task) => String(task.id) === id);

  if (!task) {
    return (
      <div id="task-detail-page">
        <h2>Task not found</h2>

        <button
          id="task-detail-back"
          type="button"
          onClick={() => navigate("/challenge/21-react-router")}
        >
          Back to list
        </button>
      </div>
    );
  }

  return (
    <div id="task-detail-page">
      <h1>{task.title}</h1>

      <p>{task.description}</p>

      <p>Priority: {task.priority}</p>

      <p>Status: {task.completed ? "Completed" : "Active"}</p>

      {task.category && <p>Category: {task.category}</p>}

      {task.tags && task.tags.length > 0 && <p>Tags: {task.tags.join(", ")}</p>}

      <button
        id="task-detail-back"
        type="button"
        onClick={() => navigate("/challenge/21-react-router")}
      >
        Back to list
      </button>
    </div>
  );
}
