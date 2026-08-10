interface StatsPanelProps {
  total?: number;
  completed?: number;
  active?: number;
  overdue?: number;
  completedPercentage?: number;
}

export default function StatsPanel(props: StatsPanelProps) {
  const total = props.total ?? 0;
  const completed = props.completed ?? 0;
  const active = props.active ?? 0;
  const overdue = props.overdue ?? 0;
  const completedPercentage = props.completedPercentage ?? 0;

  return (
    <section id="stats-panel">
      <h2>Task Statistics</h2>

      <p>Total: {total}</p>

      <p>
        Completed: {completed} ({completedPercentage}%)
      </p>

      <div
        role="progressbar"
        aria-valuenow={completedPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          style={{
            width: `${completedPercentage}%`,
            height: "10px",
          }}
        />
      </div>

      <p>Active: {active}</p>

      <p>Overdue: {overdue}</p>
    </section>
  );
}
