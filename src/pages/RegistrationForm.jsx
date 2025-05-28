/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { Link, Navigate } from "react-router-dom"
import { selectIsAuth, login } from "../store/authSlice"
import axios from "axios"
import { BASE_URL } from "../service/config"
import styles from "./RegistrationForm.module.scss"

function RegistrationForm() {
  const [error, setError] = useState("")
  const [errorPassword, setErrorPassword] = useState("")
  const dispatch = useDispatch()
  const isAuth = useSelector(selectIsAuth)
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onBlur",
  })

  const password = watch("password")
  const repeatPassword = watch("repeatPassword")
  const checked = watch("checkbox")

  const onSubmit = async (data) => {
    setLoading(true)
    const userData = {
      user: {
        username: data.username,
        email: data.email,
        password: data.password,
      },
    }
    axios
      .post(`${BASE_URL}users`, userData)
      .then((response) => {
        dispatch(login(response.data))
      })
      .catch(() => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          setError(error.response.data.errors)
        } else {
          setError("An error occurred while processing your request.")
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    if (password !== repeatPassword && repeatPassword.length !== 0) {
      setErrorPassword("Пароли не совпадают")
    } else {
      setErrorPassword("")
    }
  }, [password, repeatPassword])

  if (isAuth) {
    return <Navigate to="/" replace />
  }

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>Create new account</h3>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.labelContainer}>
          <label htmlFor="username">
            <span className={styles.titleInput}>Username</span>
            <input
              type="text"
              name="username"
              className={styles.input}
              {...register("username", {
                required: true,
                minLength: {
                  value: 6,
                  message: "Short name",
                },
                maxLength: {
                  value: 40,
                  message: "Long name",
                },
              })}
            />
            {error?.username && (
              <span className={styles.incorrectData}>{error?.username}</span>
            )}
            {Object.keys(errors).map((key) => (
              <span className="error" key={key}>
                {errors[key].message}
              </span>
            ))}
          </label>
        </div>
        <div className={styles.labelContainer}>
          <label htmlFor="email">
            <span className={styles.titleInput}>Email address</span>
            <input
              type="email"
              name="email"
              className={styles.input}
              {...register("email")}
            />
            {error && (
              <span className={styles.incorrectData}>{error?.email}</span>
            )}
          </label>
        </div>
        <div className={styles.labelContainer}>
          <label htmlFor="password">
            <span className={styles.titleInput}>Password</span>
            <input
              type="password"
              name="password"
              className={styles.input}
              {...register("password", {
                required: "The field is required ",
                minLength: {
                  value: 6,
                  message: "Too short password",
                },
                maxLength: {
                  value: 40,
                  message: "Too long password",
                },
              })}
            />
            {errors?.password && (
              <span className={styles.incorrectData}>
                {errors?.password?.message}
              </span>
            )}
          </label>
        </div>
        <div className={styles.labelContainer}>
          <label htmlFor="repeatPassword">
            <span className={styles.titleInput}>Repeat Password</span>
            <input
              type="password"
              name="repeatPassword"
              className={styles.input}
              {...register("repeatPassword")}
            />
          </label>
        </div>
        {errorPassword && (
          <span className={styles.incorrectData}>{errorPassword}</span>
        )}
        <div className={styles.labelContainer}>
          <input type="checkbox" name="checkbox" {...register("checkbox")} />
          <span className={styles.titleInput}>
            I agree to the processing of my personal information
          </span>
        </div>
        {checked ? null : (
          <span className={styles.incorrectData}>
            You have to accept an agreement
          </span>
        )}
        <button
          type="submit"
          className={`${styles.submitButton} ${loading ? styles.loading : ""}`}
          disabled={!isValid || loading}
        >
          <span style={{ display: loading ? "none" : "inline" }}>Create</span>
        </button>
      </form>
      <p className={styles.footerTitle}>
        Already have an account?
        <Link to="/sign-in" className={styles.signIn}>
          {" "}
          Sign In
        </Link>
        .
      </p>
    </div>
  )
}

export default RegistrationForm
