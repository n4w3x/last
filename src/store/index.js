import { configureStore } from "@reduxjs/toolkit"
import { apiSlice } from "../service/apiSlice"
import { authApi } from "../service/authApiSlice"

export default configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, apiSlice.middleware),
})
