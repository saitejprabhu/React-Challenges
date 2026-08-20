import { useGetPostsQuery } from "../api/apiSlice";

export default function PostsList() {
  const { data, isLoading, isError } = useGetPostsQuery();

  if (isLoading) {
    return <div data-testid="posts-loading">Loading posts...</div>;
  }

  if (isError) {
    return <div data-testid="posts-error">Error loading posts</div>;
  }

  return (
    <div data-testid="posts-list">
      {data?.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
}