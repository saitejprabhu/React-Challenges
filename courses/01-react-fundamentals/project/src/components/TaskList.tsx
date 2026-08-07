import TaskCard from "./TaskCard";
import type { Dispatch, SetStateAction } from "react";

/**
 * Represents a task in the application.
 */
export interface Task {
  id: string | number;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  completed: boolean;
  category?: string;
  tags?: string[];
  dueDate?: string | number;
}

/**
 * Props accepted by the TaskList component.
 */
interface TaskListProps {
  tasks?: Task[];
  countText?: string;
  onToggle?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  linkToTaskDetail?: boolean;

  onUpdateTask?: (id: string | number, updates: Partial<Task>) => void;

  editingId?: string | number | null;

  setEditingId?: Dispatch<SetStateAction<string | number | null>>;
}

/**
 * Static list of tasks used for Challenge 01.
 */
const HardCodedTasks: Task[] = [
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
];

/**
 * Renders all available task cards.
 */
export default function TaskList(props: TaskListProps) {
  const taskList = props.tasks ?? HardCodedTasks;

  return (
    <>
      {props.countText && <p id="task-count">{props.countText}</p>}

      <section id="task-list">
        {taskList.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            title={task.title}
            description={task.description}
            priority={task.priority}
            completed={task.completed}
            onToggle={props.onToggle}
            onDelete={props.onDelete}
            onUpdateTask={props.onUpdateTask}
            editingId={props.editingId}
            setEditingId={props.setEditingId}
          />
        ))}
      </section>
    </>
  );
}
