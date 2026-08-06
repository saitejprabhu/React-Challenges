/**
 * Props required to render a task card.
 */
interface TaskCardProps {
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  completed?: boolean;
  onToggle?: (id: string | number) => void;
  taskId?: string | number;
}

/**
 * Displays the details of a single task.
 */
export default function TaskCard(props: TaskCardProps) {
  return (
    <article
      id="task-card"
      data-completed={props.completed}
      style={{ backgroundColor: props.completed ? "#d4edda" : "#fff" }}
    >
      <h2 style={{ textDecoration: props.completed ? "line-through" : "none" }}>
        {props.title}
      </h2>
      <p style={{ textDecoration: props.completed ? "line-through" : "none" }}>
        {props.description}
      </p>
      <p>Priority: {props.priority}</p>

      <p>{props.completed ? "Completed" : "Not Completed"}</p>

      <input
        type="checkbox"
        checked={props.completed}
        onChange={() => props.onToggle?.(props.taskId!)}
      />
    </article>
  );
}
