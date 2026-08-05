/**
 * Props required to render a task card.
 */
interface TaskCardProps {
  title: string
  description: string
  priority: "Low" | "Medium" | "High"
  completed?: boolean
  onToggle?: (id: string | number) => void
  taskId?: string | number
}

/**
 * Displays the details of a single task.
 */
export default function TaskCard(props: TaskCardProps) {
  return (
    <article id="task-card">
      <h2>{props.title}</h2>
      <p>{props.description}</p>
      <p>Priority: {props.priority}</p>

      {/* Display task completion status */}
      <p>{props.completed ? "Completed" : "Not Completed"}</p>
    </article>
  )
}