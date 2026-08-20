import { useGetUsersQuery } from "../api/apiSlice";
import ErrorDisplay from "./ErrorDisplay";

// useQueryHook

export default function UsersList() {
  const query = useGetUsersQuery();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = query;

  if (isLoading) {
    return (
      <div data-testid="users-loading">
        Loading users...
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorDisplay
        error={error}
        onRetry={refetch}
      />
    );
  }

  return (
    <div data-testid="users-list">
      {data?.map((user) => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      ))}
    </div>
  );
}