/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/alt-text */
import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { selectIsAuth, logout } from "../../store/authSlice"
import styles from "./Header.module.scss"
import _ from "lodash"

function Header() {
  const isAuth = useSelector(selectIsAuth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const name = JSON.parse(localStorage.getItem("data"))
  const image = name ? name.user.image : null
  const onClickLogout = () => {
    if (window.confirm("Вы точно хотите выйти?")) {
      dispatch(logout())
      navigate("/")
      localStorage.clear()
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
                {name?.user?.username && name.user.username.length > 15
                  ? _.truncate(name.user.username, { length: 15 })
                  : name.user.username}
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
