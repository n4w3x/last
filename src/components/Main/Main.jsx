import { useSelector } from "react-redux"
import styles from "./Main.module.scss"
import { selectArticles, selectStatus } from "../../store/articlesSlice"

function Main({ children }) {
  const status = useSelector(selectStatus)
  const articles = useSelector(selectArticles)
  const loading = articles.length === 0 && status === "loading" && (
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
