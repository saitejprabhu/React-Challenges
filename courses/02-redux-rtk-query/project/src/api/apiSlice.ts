import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { mockApi } from "./mockServer";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/",
  }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      queryFn: async () => {
        const users = await mockApi.getUsers();
        return { data: users };
      },
    }),
  }),
});

export const { useGetUsersQuery } = apiSlice;