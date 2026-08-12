import { useEffect, useState } from "react";

interface TodoItem {
  id: number | string;
  title: string;
}

export default function FetchDemoView() {
  const [items, setItems] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchTodos = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/todos.json", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data: TodoItem[] = await response.json();

        setItems(data);
        setLoading(false);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchTodos();

    return () => {
      controller.abort();
    };
  }, []);

  if (loading) {
    return <div id="fetch-loading">Loading...</div>;
  }

  if (error) {
    return <div id="fetch-error">{error}</div>;
  }

  return (
    <ul id="fetch-list">
      {items.map((item) => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  );
}