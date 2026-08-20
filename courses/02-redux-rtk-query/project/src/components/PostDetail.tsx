import { useGetPostByIdQuery } from "../api/apiSlice";

interface PostDetailProps {
  postId?: number;
}

export default function PostDetail({ postId }: PostDetailProps) {
  const id = postId;

  const {
    data,
    isLoading,
    isError,
  } = useGetPostByIdQuery(id as number, {
    skip: !id,
  });

  if (!id) {
    return (
      <div data-testid="post-detail-error">
        Post ID is required.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div data-testid="post-detail-loading">
        Loading post...
      </div>
    );
  }

  if (isError) {
    return (
      <div data-testid="post-detail-error">
        Error loading post.
      </div>
    );
  }

  if (!data) {
    return (
      <div data-testid="post-detail-error">
        Post not found.
      </div>
    );
  }

  return (
    <div data-testid="post-detail">
      <h2>{data.title}</h2>
      <p>{data.body}</p>
    </div>
  );
}