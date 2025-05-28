import { configureStore } from "@reduxjs/toolkit"
import articlesSlice from "./articlesSlice"
import authSlice from "./authSlice"

export default configureStore({
  reducer: {
    articles: articlesSlice,
    auth: authSlice,
  },
})
