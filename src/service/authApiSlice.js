import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { BASE_URL } from "../service/config"

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token")
    if (token) {
      headers.set("Authorization", `Token ${token}`)
    }
    headers.set("Content-Type", "application/json")
    return headers
  },
})

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  tagTypes: ["User"],
  endpoints: (build) => ({
    login: build.mutation({
      query: (userData) => ({
        url: "users/login",
        method: "POST",
        body: userData,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled
          localStorage.setItem("token", data.user.token)
          localStorage.setItem("data", JSON.stringify(data))
        } catch {}
      },
    }),

    register: build.mutation({
      query: (userData) => ({
        url: "users",
        method: "POST",
        body: userData,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          localStorage.setItem("token", data.user.token)
          localStorage.setItem("data", JSON.stringify(data))
        } catch {}
      },
    }),

    editUser: build.mutation({
      query: (userData) => ({
        url: "user",
        method: "PUT",
        body: userData,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          localStorage.setItem("data", JSON.stringify(data))
          localStorage.setItem("image", JSON.stringify(data.user.image))
        } catch {}
      },
      invalidatesTags: ["User"],
    }),

    fetchCurrentUser: build.query({
      query: () => "user",
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          localStorage.setItem("data", JSON.stringify(data))
        } catch {}
      },
      providesTags: ["User"],
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useEditUserMutation,
  useFetchCurrentUserQuery,
} = authApi
