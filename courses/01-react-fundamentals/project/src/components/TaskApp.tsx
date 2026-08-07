import { useState, type Dispatch, type SetStateAction } from "react";
import type { Task } from "./TaskList";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import FilterBar from "./FilterBar";

interface TaskAppProps {
  tasks?: Task[];
  setTasks?: Dispatch<SetStateAction<Task[]>>;
  dispatch?: (action: { type: string; payload?: unknown }) => void;
  showForm?: boolean;
  countFormat?: string;
  showFilterBar?: boolean;
  showStatsPanel?: boolean;
  onDelete?: (id: string | number) => void;
  linkToTaskDetail?: boolean;
}

export default function TaskApp(props: TaskAppProps) {
  const { tasks = [], setTasks, showForm } = props;

  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const [sortOrder, setSortOrder] = useState("recent");

  const [editingId, setEditingId] = useState<string | number | null>(null);

  const [searchText, setSearchText] = useState("");

  const handleAddTask = (task: Task) => {
    setTasks?.((prev) => [...prev, task]);
  };

  const handleToggle = (id: string | number) => {
    setTasks?.((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task,
      ),
    );
  };

  const handleUpdateTask = (id: string | number, updates: Partial<Task>) => {
    setTasks?.((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task)),
    );
  };

  const filteredTasks =
    filter === "active"
      ? tasks.filter((task) => !task.completed)
      : filter === "completed"
        ? tasks.filter((task) => task.completed)
        : tasks;

  const searchTasks = filteredTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchText.toLowerCase()) ||
      task.description.toLowerCase().includes(searchText.toLowerCase()),
  );

  const priorityValue = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  // const sortedTasks = [...filteredTasks];
  const sortedTasks = [...searchTasks];
  const totalCount = searchTasks.length;

  switch (sortOrder) {
    case "high":
      sortedTasks.sort(
        (a, b) => priorityValue[b.priority] - priorityValue[a.priority],
      );
      break;

    case "low":
      sortedTasks.sort(
        (a, b) => priorityValue[a.priority] - priorityValue[b.priority],
      );
      break;

    case "alpha":
      sortedTasks.sort((a, b) =>
        a.title.localeCompare(b.title, undefined, {
          sensitivity: "base",
        }),
      );
      break;

    case "recent":
    default:
      break;
  }

  // const totalCount = tasks.length;

  const isCompleted = tasks.filter((task) => task.completed).length;

  return (
    <>
      {showForm && <TaskForm onAddTask={handleAddTask} />}

      {props.showFilterBar && (
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      )}

      <TaskList
        tasks={sortedTasks}
        onToggle={handleToggle}
        onDelete={props.onDelete}
        countText={`${isCompleted} of ${totalCount} completed`}
        onUpdateTask={handleUpdateTask}
        editingId={editingId}
        setEditingId={setEditingId}
      />
    </>
  );
}
