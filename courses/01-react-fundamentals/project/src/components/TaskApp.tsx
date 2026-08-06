import type { Dispatch, SetStateAction } from "react";
import type { Task } from "./TaskList";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import { useState } from "react";
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

  const [filter, setfilter] = useState<"all" | "active" | "completed">("all");
  const [sortOrder, setSortOrder] = useState("recent");

  const filteredTask =
    filter == "active"
      ? tasks.filter((task) => !task.completed)
      : filter == "completed"
        ? tasks.filter((task) => task.completed)
        : tasks;
  const priorityValue = {
    High: 3,
    Medium: 2,
    Low: 1,
  };
  const sortedTasks = [...filteredTask];

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
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
      );
      break;
    case "recent":
    default:
      break;
  }
  const showingcount = filteredTask.length;

  const totalCount = tasks.length;
  return (
    <>
      {showForm && <TaskForm onAddTask={handleAddTask} />}
      {props.showFilterBar && (
        <FilterBar
          filter={filter}
          onFilterChange={setfilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
      )}
      <TaskList
        tasks={sortedTasks}
        onToggle={handleToggle}
        onDelete={props.onDelete}
        countText={`showing ${showingcount} of ${totalCount} tasks`}
      />
    </>
  );
}