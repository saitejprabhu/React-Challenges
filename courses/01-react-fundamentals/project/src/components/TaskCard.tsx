import Button from "./Button";
import Badge from "./Badge";
import StatusIndicator from "./StatusIndicator";
import React, { useState, type Dispatch, type SetStateAction } from "react";
import type { Task } from "./TaskList";
import { Link } from "react-router-dom";

/**
 * Props required to render a task card.
 */
interface TaskCardProps {
  id: string | number;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  completed?: boolean;
  category?: string;
  tags: string[];
  onToggle?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onUpdateTask?: (id: string | number, updates: Partial<Task>) => void;
  editingId?: string | number | null;
  setEditingId?: Dispatch<SetStateAction<string | number | null>>;
  dueDate?: string | number;
  linkToTaskDetail?: boolean;
}

/**
 * Displays the details of a single task.
 */
function TaskCard(props: TaskCardProps) {
  const [title, setTitle] = useState(props.title);
  const [description, setDescription] = useState(props.description);
  const [priority, setPriority] = useState(props.priority);

  const [localEditing, setLocalEditing] = useState(false);

  const isCompleted = props.completed ?? false;
  const [dueDate, setDueDate] = useState(props.dueDate ?? "");

  const isEditing =
    props.editingId !== undefined ? props.editingId === props.id : localEditing;

  const startEditing = () => {
    setTitle(props.title);
    setDescription(props.description);
    setPriority(props.priority);
    setDueDate(props.dueDate ?? "");

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
      dueDate: dueDate || undefined,
    });

    stopEditing();
  };

  const handleCancel = () => {
    setTitle(props.title);
    setDescription(props.description);
    setPriority(props.priority);
    setDueDate(props.dueDate ?? "");

    stopEditing();
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDateValue = props.dueDate ? new Date(props.dueDate) : null;

  if (dueDateValue) {
    dueDateValue.setHours(0, 0, 0, 0);
  }
  const isOverdue =
    dueDateValue !== null && dueDateValue < today && !isCompleted;

  const isDueToday =
    dueDateValue !== null && dueDateValue.getTime() === today.getTime();

  const threeDaysFromNow = new Date(today);
  threeDaysFromNow.setDate(today.getDate() + 3);

  const isDueSoon =
    dueDateValue !== null &&
    dueDateValue > today &&
    dueDateValue <= threeDaysFromNow;

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
        <h2>
          {props.linkToTaskDetail ? (
            <Link to={`/challenge/21-react-router/task/${props.id}`}>
              {props.title}
            </Link>
          ) : (
            props.title
          )}
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
        <p>
          Priority: <Badge variant="priority">{props.priority}</Badge>
        </p>
      )}

      {isEditing ? (
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      ) : null}

      <p id="task-category">
        Category:{" "}
        <Badge variant="category">{props.category ?? "General"}</Badge>
      </p>

      <div id="task-tags">
        {(props.tags ?? []).map((tag) => (
          <Badge key={tag} variant="tag">
            {tag}
          </Badge>
        ))}
      </div>

      <p>
        {isCompleted ? <StatusIndicator status="completed" /> : "Not Completed"}
      </p>

      {isEditing ? (
        <>
          <Button onClick={handleSave} variant="primary">
            Save
          </Button>

          <Button onClick={handleCancel} variant="secondary">
            Cancel
          </Button>
        </>
      ) : (
        <>
          <Button onClick={startEditing} variant="secondary">
            Edit
          </Button>

          {props.onDelete && (
            <Button
              variant="danger"
              onClick={() => {
                if (window.confirm("Are you sure?")) {
                  props.onDelete?.(props.id);
                }
              }}
            >
              Delete
            </Button>
          )}
        </>
      )}
      {props.dueDate && (
        <p id="task-due-date" data-overdue={isOverdue ? "true" : "false"}>
          Due: {new Date(props.dueDate).toLocaleDateString()}
          {isOverdue && <StatusIndicator status="overdue" />}
          {isDueToday && <StatusIndicator status="due-today" />}
          {isDueSoon && <StatusIndicator status="due-soon" />}
        </p>
      )}
    </article>
  );
}
export default React.memo(TaskCard);
