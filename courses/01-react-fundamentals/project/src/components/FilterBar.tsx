interface FilterBarProps {
  filter: "all" | "active" | "completed";
  sortOrder: string;
  setSortOrder: (sort: string) => void;
  onFilterChange: (filter: "all" | "active" | "completed") => void;
}
export default function FilterBar(props: FilterBarProps) {
  return (
    <>
      <div id="filter-bar">
        <button
          data-active={props.filter === "all"}
          onClick={() => props.onFilterChange("all")}
        >
          All
        </button>
        <button
          data-active={props.filter === "active"}
          onClick={() => props.onFilterChange("active")}
        >
          Active
        </button>
        <button
          data-active={props.filter === "completed"}
          onClick={() => props.onFilterChange("completed")}
        >
          Completed
        </button>
      </div>
      <div>
        <select
          id="sort-order"
          value={props.sortOrder}
          onChange={(e) => props.setSortOrder(e.target.value)}
        >
          <option value="recent">Recently Added</option>
          <option value="high">Priority High to Low</option>
          <option value="low">priority Low to High</option>
          <option value="alpha">Alphabetical</option>
        </select>
      </div>
    </>
  );
}