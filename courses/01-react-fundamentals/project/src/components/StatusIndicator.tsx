/**
 * Displays a small indicator for the current task status.
 */
interface StatusIndicatorProps {
  status?: string;
}

export default function StatusIndicator({
  status,
}: StatusIndicatorProps) {
  if (!status) {
    return null;
  }

  const statusLabels: Record<string, string> = {
    overdue: "Overdue",
    "due-today": "Due Today",
    "due-soon": "Due Soon",
    completed: "Completed",
  };

  return (
    <span data-status={status}>
      {statusLabels[status] ?? status}
    </span>
  );
}