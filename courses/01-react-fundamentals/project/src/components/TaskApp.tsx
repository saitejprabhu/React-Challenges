import { useEffect, useState, useMemo } from "react";
import type { Dispatch } from "react";
import type { Task } from "./TaskList";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import FilterBar from "./FilterBar";
import StatsPanel from "./StatsPanel";
import { useTheme } from "../contexts/ThemeContext";
import Button from "./Button";
import {
  ADD_TASK,
  UPDATE_TASK,
  TOGGLE_TASK,
  TaskAction,
} from "../reducers/taskReducer";

interface TaskAppProps {
  tasks?: Task[];
  dispatch?: Dispatch<TaskAction>;
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
  const { theme, toggleTheme } = useTheme();

  const { tasks = [], showForm } = props;

  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const [sortOrder, setSortOrder] = useState("recent");

  const [editingId, setEditingId] = useState<string | number | null>(null);

  const [searchText, setSearchText] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [category, setCategory] = useState("all");

  const categories = [
    ...new Set(tasks.map((task) => task.category).filter(Boolean)),
  ];

  const stats = useMemo(() => {
    const total = tasks.length;

    const completed = tasks.filter((task) => task.completed).length;

    const active = tasks.filter((task) => !task.completed).length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdue = tasks.filter((task) => {
      if (task.completed || !task.dueDate) {
        return false;
      }

      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      return dueDate < today;
    }).length;

    const completedPercentage =
      total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      total,
      completed,
      active,
      overdue,
      completedPercentage,
    };
  }, [tasks]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);

  const handleAddTask = (task: Task) => {
    props.dispatch?.({
      type: ADD_TASK,
      payload: task,
    });
  };
  const handleToggle = (id: string | number) => {
    props.dispatch?.({
      type: TOGGLE_TASK,
      payload: id,
    });
  };

  type TaskUpdate = Partial<
    Pick<Task, "title" | "description" | "priority" | "category" | "tags">
  >;

  const handleUpdateTask = (id: string | number, updates: TaskUpdate) => {
    props.dispatch?.({
      type: UPDATE_TASK,
      payload: {
        id,
        updates,
      },
    });
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
      <Button id="theme-toggle" type="button" onClick={toggleTheme}>
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </Button>
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

      {props.showStatsPanel && (
        <StatsPanel
          total={stats.total}
          completed={stats.completed}
          active={stats.active}
          overdue={stats.overdue}
          completedPercentage={stats.completedPercentage}
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
