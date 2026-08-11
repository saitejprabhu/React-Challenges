import {
  useEffect,
  useState,
  useMemo,
  useCallback,
  type Dispatch,
} from "react";

import type { Task } from "./TaskList";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import FilterBar from "./FilterBar";
import StatsPanel from "./StatsPanel";
import { useTheme } from "../contexts/ThemeContext";
import Button from "./Button";
import ErrorBoundary from "./ErrorBoundary";
import {
  ADD_TASK,
  UPDATE_TASK,
  TOGGLE_TASK,
  type TaskAction,
} from "../reducers/taskReducer";

type TaskUpdate = Partial<
  Pick<Task, "title" | "description" | "priority" | "category" | "tags">
>;

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

export default function TaskApp(props: TaskAppProps) {
  const { theme, toggleTheme } = useTheme();

  const { tasks = [], showForm, dispatch } = props;

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

  const handleAddTask = useCallback(
    (task: Task) => {
      dispatch?.({
        type: ADD_TASK,
        payload: task,
      });
    },
    [dispatch],
  );

  const handleToggle = useCallback(
    (id: string | number) => {
      dispatch?.({
        type: TOGGLE_TASK,
        payload: id,
      });
    },
    [dispatch],
  );

  const handleUpdateTask = useCallback(
    (id: string | number, updates: TaskUpdate) => {
      dispatch?.({
        type: UPDATE_TASK,
        payload: {
          id,
          updates,
        },
      });
    },
    [dispatch],
  );

  const sortedTasks = useMemo(() => {
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

    const result = [...searchTasks];

    switch (sortOrder) {
      case "high":
        result.sort(
          (a, b) => priorityValue[b.priority] - priorityValue[a.priority],
        );
        break;

      case "low":
        result.sort(
          (a, b) => priorityValue[a.priority] - priorityValue[b.priority],
        );
        break;

      case "alpha":
        result.sort((a, b) =>
          a.title.localeCompare(b.title, undefined, {
            sensitivity: "base",
          }),
        );
        break;

      case "dueDate":
        result.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;

          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        break;

      case "recent":
      default:
        break;
    }

    return result;
  }, [tasks, filter, category, debouncedSearch, sortOrder]);

  const showingCount = sortedTasks.length;
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

      <ErrorBoundary>
        <TaskList
          tasks={sortedTasks}
          onToggle={handleToggle}
          onDelete={props.onDelete}
          countText={`Showing ${showingCount} of ${totalCount} tasks`}
          onUpdateTask={handleUpdateTask}
          editingId={editingId}
          setEditingId={setEditingId}
        />
      </ErrorBoundary>
    </>
  );
}
