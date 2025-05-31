import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { BASE_URL } from "../service/config"

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem("token")
    if (token) {
      headers.set("Authorization", `Token ${token}`)
    }
    headers.set("Content-Type", "application/json")
    return headers
  },
})

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Article", "ArticleList"],
  endpoints: (build) => ({
    fetchArticles: build.query({
      query: (offset = 0) => `articles?limit=5&offset=${offset}`,
      providesTags: (result) =>
        result?.articles
          ? [
              ...result.articles.map(({ slug }) => ({
                type: "Article",
                id: slug,
              })),
              { type: "ArticleList", id: "LIST" },
            ]
          : [{ type: "ArticleList", id: "LIST" }],
    }),

    fetchArticle: build.query({
      query: (slug) => `articles/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Article", id: slug }],
    }),

    createArticle: build.mutation({
      query: (userData) => ({
        url: "articles",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: [{ type: "ArticleList", id: "LIST" }],
    }),

    editArticle: build.mutation({
      query: ({ slug, userData }) => ({
        url: `articles/${slug}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: (result, error, { slug }) => [
        { type: "Article", id: slug },
        { type: "ArticleList", id: "LIST" },
      ],
    }),

    deleteArticle: build.mutation({
      query: (slug) => ({
        url: `articles/${slug}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "ArticleList", id: "LIST" }],
    }),

    likeArticle: build.mutation({
      query: (slug) => ({
        url: `articles/${slug}/favorite`,
        method: "POST",
      }),
      invalidatesTags: (result, error, slug) => [
        { type: "Article", id: slug },
        { type: "ArticleList", id: "LIST" },
      ],
    }),

    unlikeArticle: build.mutation({
      query: (slug) => ({
        url: `articles/${slug}/favorite`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, slug) => [
        { type: "Article", id: slug },
        { type: "ArticleList", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useFetchArticlesQuery,
  useFetchArticleQuery,
  useCreateArticleMutation,
  useEditArticleMutation,
  useDeleteArticleMutation,
  useLikeArticleMutation,
  useUnlikeArticleMutation,
} = apiSlice
