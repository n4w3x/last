import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useFetchCurrentUserQuery } from "../../service/authApiSlice"
import styles from "./Header.module.scss"
import _ from "lodash"

function Header() {
  const navigate = useNavigate()

  const token = localStorage.getItem("token")
  const { data, isSuccess } = useFetchCurrentUserQuery(undefined, {
    skip: !token,
  })

  const user = data?.user
  const username = user?.username
  const image = user?.image

  const isAuth = isSuccess && !!user

  const onClickLogout = () => {
    if (window.confirm("Вы точно хотите выйти?")) {
      localStorage.clear()
      navigate("/")
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.wrapper}>
        <Link className={styles.title} to="/">
          Realworld Blog
        </Link>
        <div className={styles.loginContainer}>
          {isAuth ? (
            <>
              <Link className={styles.buttonCreateArticle} to="/new-article">
                Create Article
              </Link>
              <Link className={styles.nameUser} to="/profile">
                {username?.length > 15
                  ? _.truncate(username, { length: 15 })
                  : username}
              </Link>
              <img
                className={styles.imageUser}
                src={
                  image ||
                  "https://static.productionready.io/images/smiley-cyrus.jpg"
                }
              />
              <button className={styles.buttonLogOut} onClick={onClickLogout}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link className={styles.signIn} to="/sign-in">
                Sign In
              </Link>
              <Link className={styles.signUp} to="/sign-up">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
