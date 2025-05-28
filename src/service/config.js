export const BASE_URL = "https://blog-platform.kata.academy/api/"
export const ALL_ARTICLES = `${BASE_URL}articles?limit=5&offset=5`
export const getArticle = (slug) => `${BASE_URL}articles/${slug}`
