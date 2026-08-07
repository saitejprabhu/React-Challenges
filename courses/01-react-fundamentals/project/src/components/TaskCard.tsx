import { useState, type Dispatch, type SetStateAction } from "react";
import type { Task } from "./TaskList";

/**
 * Props required to render a task card.
 */
interface TaskCardProps {
  id: string | number;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  completed?: boolean;
  onToggle?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onUpdateTask?: (id: string | number, updates: Partial<Task>) => void;
  editingId?: string | number | null;
  setEditingId?: Dispatch<SetStateAction<string | number | null>>;
}

/**
 * Displays the details of a single task.
 */
export default function TaskCard(props: TaskCardProps) {
  const [title, setTitle] = useState(props.title);
  const [description, setDescription] = useState(props.description);
  const [priority, setPriority] = useState(props.priority);

  const [localEditing, setLocalEditing] = useState(false);

  const isCompleted = props.completed ?? false;

  const isEditing =
    props.editingId !== undefined ? props.editingId === props.id : localEditing;

  const startEditing = () => {
    setTitle(props.title);
    setDescription(props.description);
    setPriority(props.priority);

    if (props.setEditingId) {
      props.setEditingId(props.id);
    } else {
      setLocalEditing(true);
    }
  };

  const stopEditing = () => {
    if (props.setEditingId) {
      props.setEditingId(null);
    } else {
      setLocalEditing(false);
    }
  };

  const handleSave = () => {
    if (!title.trim()) return;

    props.onUpdateTask?.(props.id, {
      title,
      description,
      priority,
    });

    stopEditing();
  };

  const handleCancel = () => {
    setTitle(props.title);
    setDescription(props.description);
    setPriority(props.priority);

    stopEditing();
  };

  return (
    <article id="task-card" data-completed={isCompleted}>
      {props.onToggle && (
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => props.onToggle?.(props.id)}
        />
      )}

      {isEditing ? (
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      ) : (
        <h2
          style={{
            textDecoration: isCompleted ? "line-through" : "none",
          }}
        >
          {props.title}
        </h2>
      )}

      {isEditing ? (
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      ) : (
        <p
          style={{
            textDecoration: isCompleted ? "line-through" : "none",
          }}
        >
          {props.description}
        </p>
      )}

      {isEditing ? (
        <select
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value as "Low" | "Medium" | "High")
          }
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      ) : (
        <p>Priority: {props.priority}</p>
      )}

      <p>{isCompleted ? "Completed" : "Not Completed"}</p>

      {isEditing ? (
        <>
          <button onClick={handleSave}>Save</button>

          <button onClick={handleCancel}>Cancel</button>
        </>
      ) : (
        <>
          <button onClick={startEditing}>Edit</button>

          {props.onDelete && (
            <button
              onClick={() => {
                if (window.confirm("Are you sure?")) {
                  props.onDelete?.(props.id);
                }
              }}
            >
              Delete
            </button>
          )}
        </>
      )}
    </article>
  );
}
