import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { BASE_URL } from "../service/config"
import axios from "axios"

export const selectArticles = (state) => state.articles.articles
export const selectArticle = (state) => state.articles.article
export const selectStatus = (state) => state.articles.status
export const selectError = (state) => state.articles.error
export const selectPage = (state) => state.articles.page
export const selectFlag = (state) => state.articles.flag

export const fetchArticles = createAsyncThunk(
  "articles/fetchArticles",
  async (offset) => {
    const headers = {
      "content-type": "application/json",
      Authorization: `Token ${localStorage.getItem("token")}`,
    }
    const response = await fetch(
      `${BASE_URL}articles?limit=5&offset=${offset}`,
      { headers }
    )
    if (!response.ok) {
      throw new Error("Server Error!")
    }
    const data = await response.json()
    return data.articles
  }
)

export const fetchCreateArticle = createAsyncThunk(
  "articles/fetchCreateArticle",
  async (userData) => {
    const token = localStorage.getItem("token")
    const response = await axios.post(
      `https://blog.kata.academy/api/articles`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    )
    return response.data.article
  }
)

export const fetchDeleteArticle = createAsyncThunk(
  "articles/fetchDeleteArticle",
  async (slug) => {
    const token = localStorage.getItem("token")
    await axios.delete(`https://blog.kata.academy/api/articles/${slug}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
  }
)

export const fetchEditArticle = createAsyncThunk(
  "articles/fetchEditArticle",
  async (payload) => {
    const { slug } = payload
    const token = localStorage.getItem("token")
    const response = await axios.put(
      `https://blog.kata.academy/api/articles/${slug}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    )
    return response.data
  }
)

export const fetchLikeArticle = createAsyncThunk(
  "articles/fetchLikeArticle",
  async (slug) => {
    const token = localStorage.getItem("token")
    const response = await axios.post(
      `${BASE_URL}articles/${slug}/favorite`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    )
    return response.data.article
  }
)

export const fetchLikeDelete = createAsyncThunk(
  "articles/fetchLikeDelete",
  async (slug) => {
    const token = localStorage.getItem("token")
    const response = await axios.delete(
      `https://blog.kata.academy/api/articles/${slug}/favorite`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    )
    return response.data.article
  }
)

const articlesSlice = createSlice({
  name: "articles",
  initialState: {
    articles: [],
    article: null,
    status: null,
    error: null,
    page: 1,
    flag: false,
  },
  reducers: {
    changePage(state, action) {
      state.page = action.payload
    },
    addArticlesArr(state, action) {
      state.articles = state.articles.concat(action.payload)
    },
    getArticle(state, action) {
      state.article = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.status = "resolved"
        state.articles = action.payload
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.status = "rejected"
        state.error = action.error?.message || "Failed to fetch articles."
      })

      .addCase(fetchCreateArticle.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchCreateArticle.fulfilled, (state, action) => {
        state.status = "resolved"
        state.articles.push(action.payload)
      })
      .addCase(fetchCreateArticle.rejected, (state, action) => {
        state.status = "rejected"
        state.error = action.error?.message || "Failed to create article."
      })

      .addCase(fetchEditArticle.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchEditArticle.fulfilled, (state, action) => {
        state.status = "resolved"
        state.articles.push(action.payload.article)
      })
      .addCase(fetchEditArticle.rejected, (state, action) => {
        state.status = "rejected"
        state.error = action.error?.message || "Failed to edit article."
      })

      .addCase(fetchLikeArticle.fulfilled, (state, action) => {
        state.status = "resolved"
        state.articles = state.articles.map((article) =>
          article.slug === action.payload.slug ? action.payload : article
        )
        localStorage.setItem(`like_${action.payload.slug}`, true)
      })

      .addCase(fetchLikeDelete.fulfilled, (state, action) => {
        state.status = "resolved"
        state.articles = state.articles.map((article) =>
          article.slug === action.payload.slug ? action.payload : article
        )
        localStorage.removeItem(`like_${action.payload.slug}`)
      })
  },
})

export const { changePage, getArticle } = articlesSlice.actions
export default articlesSlice.reducer
