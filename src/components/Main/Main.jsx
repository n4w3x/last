import React from "react"

import styles from "./Main.module.scss"

function Main({ children }) {
  return (
    <main className={styles.Wrapper}>
      <div className={styles.Container}>{children}</div>
    </main>
  )
}

export default Main
