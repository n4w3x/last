import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Link, Navigate } from "react-router-dom"

import { useRegisterMutation } from "../service/authApiSlice"

import styles from "./RegistrationForm.module.scss"

function RegistrationForm({ setToken }) {
  const [errorPassword, setErrorPassword] = useState("")
  const [registerUser, { data, isLoading, error: registerError, isSuccess }] =
    useRegisterMutation()

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm({
    mode: "onBlur",
  })

  const password = watch("password")
  const repeatPassword = watch("repeatPassword")
  const checked = watch("checkbox")

  useEffect(() => {
    if (password !== repeatPassword && repeatPassword.length !== 0) {
      setErrorPassword("Пароли не совпадают")
    } else {
      setErrorPassword("")
    }
  }, [password, repeatPassword])

  useEffect(() => {
    if (registerError && registerError.data?.errors) {
      Object.entries(registerError.data.errors).forEach(([field, messages]) => {
        setError(field, {
          type: "server",
          message: messages.join(", "),
        })
      })
    } else {
      clearErrors()
    }
  }, [registerError, setError, clearErrors])

  useEffect(() => {
    if (isSuccess && data?.user?.token) {
      localStorage.setItem("token", data.user.token)
      setToken(data.user.token)
    }
  }, [isSuccess, data, setToken])

  const onSubmit = (formData) => {
    if (!checked) {
      setError("checkbox", {
        type: "manual",
        message: "You have to accept an agreement",
      })
      return
    }
    setErrorPassword("")
    clearErrors("checkbox")

    const userData = {
      user: {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      },
    }
    registerUser(userData)
  }

  if (isSuccess && data?.user?.token) {
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
                required: "Username is required",
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
            {errors.username && (
              <span className={styles.incorrectData}>
                {errors.username.message}
              </span>
            )}
          </label>
        </div>

        <div className={styles.labelContainer}>
          <label htmlFor="email">
            <span className={styles.titleInput}>Email address</span>
            <input
              type="email"
              name="email"
              className={styles.input}
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <span className={styles.incorrectData}>
                {errors.email.message}
              </span>
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
                required: "The field is required",
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
            {errors.password && (
              <span className={styles.incorrectData}>
                {errors.password.message}
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
          {errors.checkbox && (
            <span className={styles.incorrectData}>
              {errors.checkbox.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          className={`${styles.submitButton} ${isLoading ? styles.loading : ""}`}
          disabled={!isValid || isLoading}
        >
          <span style={{ display: isLoading ? "none" : "inline" }}>Create</span>
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
