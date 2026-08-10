interface FilterBarProps {
  filter: "all" | "active" | "completed";
  sortOrder: string;
  searchText: string;
  setSearchText: (text: string) => void;
  setSortOrder: (sort: string) => void;
  onFilterChange: (filter: "all" | "active" | "completed") => void;
  isSearching: boolean;
  categories: string[];
  category: string;
  onCategoryChange: (category: string) => void;
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
      <div>
        <input
          type="text"
          id="search-input"
          placeholder="Search Tasks..."
          value={props.searchText}
          onChange={(e) => props.setSearchText(e.target.value)}
        />
        {props.isSearching && <p id="searching-indicator">Searching...</p>}
        {props.searchText && (
          <button id="clear-search" onClick={() => props.setSearchText("")}>
            clear Search
          </button>
        )}
      </div>

      <select
        value={props.category}
        onChange={(e) => props.onCategoryChange(e.target.value)}
      >
        <option value="all">All categories</option>
        {props.categories.map((category) => (
          <option value={category} key={category}>
            {category}
          </option>
        ))}
      </select>
    </>
  );
}
