import React from "react"
import styles from "./Main.module.scss"
import { useFetchArticlesQuery } from "../../service/apiSlice"

function Main({ children }) {
  const { data: articles = [], isLoading } = useFetchArticlesQuery()

  const loading = articles.length === 0 && isLoading && (
    <div className={styles.Spinner} />
  )

  return (
    <main className={styles.Wrapper}>
      <div className={styles.Container}>{children}</div>
      {loading}
    </main>
  )
}

export default Main
