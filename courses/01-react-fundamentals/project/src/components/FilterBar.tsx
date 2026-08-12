import Button from "./Button";
import { useEffect, useRef } from "react";

interface FilterBarProps {
  // Existing props used by previous challenges
  filter?: "all" | "active" | "completed";
  sortOrder?: string;
  searchText?: string;
  setSearchText?: (text: string) => void;
  setSortOrder?: (sort: string) => void;
  onFilterChange?: (filter: "all" | "active" | "completed") => void;
  isSearching?: boolean;
  categories?: string[];
  category?: string;
  onCategoryChange?: (category: string) => void;

  // Challenge 23 test props
  searchQuery?: string;
  onSearchChange?: (text: string) => void;
}

export default function FilterBar(props: FilterBarProps) {
  // Reference to the search input
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when FilterBar mounts
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Support both searchText and searchQuery
  const searchValue = props.searchText ?? props.searchQuery ?? "";

  // Support both setSearchText and onSearchChange
  const handleSearchChange = (value: string) => {
    props.setSearchText?.(value);
    props.onSearchChange?.(value);
  };

  // Support both old and new filter props
  const currentFilter = props.filter ?? "all";
  const currentSortOrder = props.sortOrder ?? "recent";
  const currentCategory = props.category ?? "all";

  return (
    <>
      {/* Filter buttons */}
      <div id="filter-bar">
        <button
          data-active={currentFilter === "all"}
          onClick={() => props.onFilterChange?.("all")}
        >
          All
        </button>

        <button
          data-active={currentFilter === "active"}
          onClick={() => props.onFilterChange?.("active")}
        >
          Active
        </button>

        <button
          data-active={currentFilter === "completed"}
          onClick={() => props.onFilterChange?.("completed")}
        >
          Completed
        </button>
      </div>

      {/* Sort */}
      <div>
        <select
          id="sort-order"
          value={currentSortOrder}
          onChange={(e) => props.setSortOrder?.(e.target.value)}
        >
          <option value="recent">Recently Added</option>
          <option value="high">Priority High to Low</option>
          <option value="low">Priority Low to High</option>
          <option value="alpha">Alphabetical</option>
          <option value="dueDate">Due Date (Soonest First)</option>
        </select>
      </div>

      {/* Search */}
      <div>
        <input
          id="search-input"
          ref={searchInputRef}
          type="text"
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
        />

        {props.isSearching && (
          <p id="searching-indicator">Searching...</p>
        )}

        {searchValue && (
          <Button
            id="clear-search"
            variant="secondary"
            onClick={() => handleSearchChange("")}
          >
            Clear Search
          </Button>
        )}
      </div>

      {/* Category */}
      <select
        value={currentCategory}
        onChange={(e) => props.onCategoryChange?.(e.target.value)}
      >
        <option value="all">All categories</option>

        {(props.categories ?? []).map((category) => (
          <option value={category} key={category}>
            {category}
          </option>
        ))}
      </select>
    </>
  );
}