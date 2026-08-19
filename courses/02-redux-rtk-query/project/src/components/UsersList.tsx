import { useGetUsersQuery } from "../api/apiSlice";

export default function UsersList() {
  const { data, isLoading, isError, error } = useGetUsersQuery();

  if (isLoading) {
    return <div data-testid="users-loading">Loading...</div>;
  }

  if (isError) {
    return (
      <div data-testid="users-error">
        Error loading users
        {error && "status" in error ? `: ${error.status}` : ""}
      </div>
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