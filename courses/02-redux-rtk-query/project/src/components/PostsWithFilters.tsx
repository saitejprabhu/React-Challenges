import { useGetPostsQuery } from "../api/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { setSortBy } from "../store/slices/filtersSlice";

export default function PostsWithFilters() {
  const { data, isLoading, isError } = useGetPostsQuery();

  const filters = useSelector((state: RootState) => state.filters);
  const dispatch = useDispatch<AppDispatch>();

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  if (isError) {
    return <div>Error loading posts.</div>;
  }

  const sortedPosts = [...(data ?? [])].sort((a, b) => {
    if (filters.sortBy === "newest") {
      return b.id - a.id;
    }

    return a.id - b.id;
  });

  return (
    <div data-testid="posts-with-filters">
      <div data-testid="filter-controls">
        <label htmlFor="sort-posts">Sort posts:</label>

        <select
          id="sort-posts"
          value={filters.sortBy}
          onChange={(event) =>
            dispatch(
              setSortBy(event.target.value as "newest" | "oldest")
            )
          }
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      <div>
        {sortedPosts.map((post) => (
          <article key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}