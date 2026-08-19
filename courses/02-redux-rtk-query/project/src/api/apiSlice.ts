import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { mockApi } from "./mockServer";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: "/",
  }),

  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      queryFn: async () => {
        const users = await mockApi.getUsers();

        return {
          data: users as User[],
        };
      },
    }),
  }),
});

export const { useGetUsersQuery } = apiSlice;