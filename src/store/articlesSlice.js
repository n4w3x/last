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
    if (!response.ok) throw new Error("Server Error!")
    const data = await response.json()
    return data.articles
  }
)

export const fetchCreateArticle = createAsyncThunk(
  "articles/fetchCreateArticle",
  async (userData) => {
    const token = localStorage.getItem("token")
    const response = await axios.post(`${BASE_URL}/articles`, userData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
    return response.data.article
  }
)

export const fetchDeleteArticle = createAsyncThunk(
  "articles/fetchDeleteArticle",
  async (slug) => {
    const token = localStorage.getItem("token")
    await axios.delete(`${BASE_URL}/articles/${slug}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
    return slug
  }
)

export const fetchEditArticle = createAsyncThunk(
  "articles/fetchEditArticle",
  async ({ slug, userData }) => {
    const token = localStorage.getItem("token")
    const response = await axios.put(`${BASE_URL}/articles/${slug}`, userData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
    return response.data.article
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
      `${BASE_URL}/articles/${slug}/favorite`,
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

      .addCase(fetchCreateArticle.fulfilled, (state, action) => {
        state.articles.push(action.payload)
      })

      .addCase(fetchEditArticle.fulfilled, (state, action) => {
        const editedArticle = action.payload
        state.articles = state.articles.map((article) =>
          article.slug === editedArticle.slug ? editedArticle : article
        )
      })

      .addCase(fetchDeleteArticle.fulfilled, (state, action) => {
        const deletedSlug = action.payload
        state.articles = state.articles.filter(
          (article) => article.slug !== deletedSlug
        )
      })

      .addCase(fetchLikeArticle.fulfilled, (state, action) => {
        state.articles = state.articles.map((article) =>
          article.slug === action.payload.slug ? action.payload : article
        )
        localStorage.setItem(`like_${action.payload.slug}`, true)
      })
      .addCase(fetchLikeDelete.fulfilled, (state, action) => {
        state.articles = state.articles.map((article) =>
          article.slug === action.payload.slug ? action.payload : article
        )
        localStorage.removeItem(`like_${action.payload.slug}`)
      })
  },
})

export const { changePage, getArticle } = articlesSlice.actions
export default articlesSlice.reducer
