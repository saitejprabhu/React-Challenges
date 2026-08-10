import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
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
  onUpdateTask?: (id: string | number, updates: TaskUpdate) => void;
}

type TaskUpdate = {
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
};

export default function TaskApp(props: TaskAppProps) {
  const { tasks = [], setTasks, showForm } = props;

  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const [sortOrder, setSortOrder] = useState("recent");

  const [editingId, setEditingId] = useState<string | number | null>(null);

  const [searchText, setSearchText] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [category, setCategory] = useState("all");

  const categories = [
    ...new Set(tasks.map((task) => task.category).filter(Boolean)),
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);

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

  type TaskUpdate = Partial<
    Pick<Task, "title" | "description" | "priority" | "category" | "tags">
  >;

  const handleUpdateTask = (id: string | number, updates: TaskUpdate) => {
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

  const categoryFilteredTasks =
    category === "all"
      ? filteredTasks
      : filteredTasks.filter((task) => task.category === category);

  const searchTasks = categoryFilteredTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      task.description.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  const priorityValue = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  // const sortedTasks = [...filteredTasks];
  const sortedTasks = [...searchTasks];
  // const totalCount = searchTasks.length;

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

    case "dueDate":
      sortedTasks.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;

        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
      break;
  }

  const showingCount = searchTasks.length;
  const totalCount = tasks.length;

  // const isCompleted = tasks.filter((task) => task.completed).length;

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
          isSearching={searchText !== debouncedSearch}
          categories={categories}
          category={category}
          onCategoryChange={setCategory}
        />
      )}

      <TaskList
        tasks={sortedTasks}
        onToggle={handleToggle}
        onDelete={props.onDelete}
        countText={`Showing ${showingCount} of ${totalCount} tasks`}
        onUpdateTask={handleUpdateTask}
        editingId={editingId}
        setEditingId={setEditingId}
      />
    </>
  );
}
