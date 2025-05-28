import styles from "./List.module.scss"

function List({ children }) {
  return <section className={styles.Wrapper}>{children}</section>
}

export default List
