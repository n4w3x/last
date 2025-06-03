import React from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Pagination } from "antd"

import { useFetchArticlesQuery } from "../service/apiSlice"
import List from "../components/List/List"
import Card from "../components/Card/Card"

import styles from "./HomePage.module.scss"

function HomePage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const currentPage = Number(searchParams.get("page")) || 1
  const offset = (currentPage - 1) * 5

  const {
    data: articleData,
    isLoading,
    isError,
    error,
  } = useFetchArticlesQuery(offset)

  const articles = articleData?.articles || []
  const articlesCount = articleData?.articlesCount || 0

  const handlePageChange = (page) => {
    setSearchParams({ page })
  }

  const articlesPagination = (
    <Pagination
      current={currentPage}
      total={articlesCount}
      onChange={handlePageChange}
      pageSize={5}
      showSizeChanger={false}
    />
  )

  if (isLoading) {
    return (
      <List>
        <div className={styles.Spinner} />
      </List>
    )
  }

  if (isError) {
    return (
      <List>
        <div style={{ color: "red" }}>
          Error loading articles: {error?.status || "Unknown error"}
        </div>
      </List>
    )
  }

  return (
    <List>
      {articles.map((el) => (
        <Card
          key={el.slug}
          username={el.author.username}
          img={el.author.image}
          title={el.title}
          date={el.createdAt}
          description={el.description}
          tags={el.tagList}
          likesNumber={el.favoritesCount}
          favorited={el.favorited}
          slug={el.slug}
          onClick={() => navigate(`/articles/${el.slug}`)}
        />
      ))}
      {articles.length > 0 && articlesPagination}
    </List>
  )
}

export default HomePage
