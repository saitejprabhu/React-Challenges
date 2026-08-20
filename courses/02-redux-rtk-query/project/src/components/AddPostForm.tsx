import { useState, type FormEvent } from "react";
import { useCreatePostMutation } from "../api/apiSlice";

export default function AddPostForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const [createPost, { isLoading, isSuccess, isError }] =
    useCreatePostMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !body.trim()) {
      return;
    }

    try {
      await createPost({
        userId: 1,
        title: title.trim(),
        body: body.trim(),
      }).unwrap();

      setTitle("");
      setBody("");
    } catch {
      // Error is handled through isError
    }
  };

  return (
    <form data-testid="add-post-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="post-title">Title</label>
        <input
          id="post-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div>
        <label htmlFor="post-body">Body</label>
        <textarea
          id="post-body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
        />
      </div>

      <button
        type="submit"
        data-testid="add-post-submit"
        disabled={isLoading}
      >
        {isLoading ? "Adding..." : "Add Post"}
      </button>

      {isSuccess && <p>Post added successfully!</p>}
      {isError && <p>Failed to add post.</p>}
    </form>
  );
}