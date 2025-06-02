import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import _ from "lodash"

import { authApi } from "../../service/authApiSlice"

import styles from "./Header.module.scss"

function Header({ token, setToken }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    data: userData,
    isLoading,
    isError,
  } = authApi.useFetchCurrentUserQuery(undefined, {
    skip: !token,
  })

  const isAuth = Boolean(userData?.user)
  const username = userData?.user?.username
  const image = userData?.user?.image

  const onClickLogout = () => {
    if (window.confirm("Вы точно хотите выйти?")) {
      localStorage.clear()
      dispatch(authApi.util.resetApiState())
      setToken(null)
      navigate("/")
    }
  }

  if (isLoading) {
    return (
      <header className={styles.header}>
        <div className={styles.wrapper}>Загрузка...</div>
      </header>
    )
  }

  if (isError || !token) {
    return (
      <header className={styles.header}>
        <div className={styles.wrapper}>
          <Link className={styles.title} to="/">
            Realworld Blog
          </Link>
          <div className={styles.loginContainer}>
            <Link className={styles.signIn} to="/sign-in">
              Sign In
            </Link>
            <Link className={styles.signUp} to="/sign-up">
              Sign Up
            </Link>
          </div>
        </div>
      </header>
    )
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
                alt="User avatar"
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
