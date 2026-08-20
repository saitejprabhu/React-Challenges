import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { mockApi, type Post, type User } from "./mockServer";

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: "/",
  }),

  tagTypes: ["User", "Post"],

  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      queryFn: async () => {
        const users = await mockApi.getUsers();
        return { data: users };
      },

      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "User" as const,
                id,
              })),
              { type: "User" as const, id: "LIST" },
            ]
          : [{ type: "User" as const, id: "LIST" }],
    }),

    getPosts: builder.query<Post[], void>({
      queryFn: async () => {
        const posts = await mockApi.getPosts();
        return { data: posts };
      },

      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Post" as const,
                id,
              })),
              { type: "Post" as const, id: "LIST" },
            ]
          : [{ type: "Post" as const, id: "LIST" }],
    }),

    getPostById: builder.query<Post, number>({
      queryFn: async (id) => {
        try {
          const post = await mockApi.getPostById(id);
          return { data: post };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error:
                error instanceof Error ? error.message : "Failed to fetch post",
            },
          };
        }
      },

      providesTags: (_result, _error, id) => [{ type: "Post", id }],
    }),
  }),
});

export const { useGetUsersQuery, useGetPostsQuery, useGetPostByIdQuery } =
  apiSlice;
