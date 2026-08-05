import TaskCard from "./TaskCard"

/**
 * Represents a task in the application.
 */
export interface Task {
  id: string | number
  title: string
  description: string
  priority: "Low" | "Medium" | "High"
  completed: boolean
  // category?: string
  // tags?: string[]
  //dueDate?: string | number
}

/**
 * Props accepted by the TaskList component.
 */
interface TaskListProps {
  tasks?: Task[]
  countText?: string
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  //linkToTaskDetail?: boolean
}

/**
 * Static list of tasks used for Challenge 01.
 */
const taskList: Task[] = [
  {
    id: 1,
    title: "Task One",
    description: "First hardcoded task",
    priority: "High",
    completed: false,
  },
  {
    id: 2,
    title: "Task Two",
    description: "Second hardcoded task",
    priority: "Medium",
    completed: false,
  },
  {
    id: 3,
    title: "Task Three",
    description: "Third hardcoded task",
    priority: "Low",
    completed: true,
  },
]

/**
 * Renders all available task cards.
 */
export default function TaskList(props: TaskListProps) {
  return (
    <section id="task-list">
      {taskList.map((task) => (
        <TaskCard
          key={task.id}
          title={task.title}
          description={task.description}
          priority={task.priority}
          completed={task.completed}
          onToggle={props.onToggle}
          taskId={task.id}
        />
      ))}
    </section>
  )
}