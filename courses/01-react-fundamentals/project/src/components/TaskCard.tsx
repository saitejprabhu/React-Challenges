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
}

/**
 * Displays the details of a single task.
 */
export default function TaskCard(props: TaskCardProps) {
  const isCompleted = props.completed ?? false;

  return (
    <article id="task-card" data-completed={isCompleted}>
      {props.onToggle && (
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => props.onToggle?.(props.id)}
        />
      )}

      <h2
        style={{
          textDecoration: isCompleted ? "line-through" : "none",
        }}
      >
        {props.title}
      </h2>

      <p
        style={{
          textDecoration: isCompleted ? "line-through" : "none",
        }}
      >
        {props.description}
      </p>
      <p>Priority: {props.priority}</p>

      <p>{isCompleted ? "Completed" : "Not Completed"}</p>
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
    </article>
  );
}