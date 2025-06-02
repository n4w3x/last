import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Navigate } from "react-router-dom"

import { useLoginMutation } from "../service/authApiSlice"

import styles from "./RegistrationForm.module.scss"

function LoginForm({ setToken }) {
  const [error, setError] = useState("")
  const [errorPass, setErrorPass] = useState("")
  const [login, { data, isLoading, error: loginError, isSuccess }] =
    useLoginMutation()

  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm({
    mode: "onBlur",
  })

  const email = watch("email")

  useEffect(() => {
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      setError("Email data is incorrect")
    } else {
      setError("")
    }
  }, [email])

  useEffect(() => {
    if (loginError) {
      if (loginError.data?.errors) {
        setError(Object.values(loginError.data.errors).flat().join(", "))
      } else if (loginError.status === 401) {
        setErrorPass("Incorrect password")
      } else {
        setError("An error occurred while processing your request.")
      }
    } else {
      setError("")
      setErrorPass("")
    }
  }, [loginError])

  const onSubmit = (formData) => {
    const userData = {
      user: {
        email: formData.email,
        password: formData.password,
      },
    }
    login(userData)
  }

  useEffect(() => {
    if (isSuccess && data?.user?.token) {
      localStorage.setItem("token", data.user.token)
      setToken(data.user.token)
    }
  }, [isSuccess, data, setToken])

  if (isSuccess && data?.user?.token) {
    return <Navigate to="/" replace />
  }

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>Sign In</h3>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.labelContainer}>
          <label htmlFor="email">
            <span className={styles.titleInput}>Email address</span>
            <input
              type="email"
              name="email"
              className={styles.input}
              {...register("email", { required: true })}
            />
            {error && <span className={styles.incorrectData}>{error}</span>}
          </label>
        </div>
        <div className={styles.labelContainer}>
          <label htmlFor="password">
            <span className={styles.titleInput}>Password</span>
            <input
              type="password"
              name="password"
              className={styles.input}
              {...register("password", { required: true })}
            />
            {errorPass && (
              <span className={styles.incorrectData}>{errorPass}</span>
            )}
          </label>
        </div>

        <button
          type="submit"
          className={`${styles.submitButton} ${isLoading ? styles.loading : ""}`}
          disabled={!isValid || isLoading}
        >
          <span style={{ display: isLoading ? "none" : "inline" }}>Login</span>
        </button>
      </form>
    </div>
  )
}

export default LoginForm
