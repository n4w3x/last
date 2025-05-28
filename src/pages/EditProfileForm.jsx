/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { edit } from "../store/authSlice"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../service/config"
import axios from "axios"
import styles from "./EditProfileForm.module.scss"

function EditProfileForm() {
  const [cirrentUserData, setUserData] = useState({})
  const [error, setError] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onBlur",
  })

  const email = watch("email")

  const onSubmit = (data) => {
    setLoading(true)
    const userData = {
      user: {
        username: data.username || cirrentUserData.username,
        email: data.email || cirrentUserData.email,
        password: data.password || "",
        image: data.imageUrl || cirrentUserData.image,
      },
    }
    const token = localStorage.getItem("token")

    axios
      .put(`${BASE_URL}user`, userData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        dispatch(edit(response.data))
        navigate("/")
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
    async function fetchData() {
      const token = localStorage.getItem("token")
      const response = await axios.get(`${BASE_URL}user`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      setUserData({
        username: response.data.user.username,
        email: response.data.user.email,
        image: response.data.user.image,
      })
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      setError("Email data is incorrect")
    } else {
      setError("")
    }
  }, [email])

  const handleInputChange = (e) => {
    setUserData({ ...cirrentUserData, [e.target.name]: e.target.value })
  }

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>Edit Profile</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.labelContainer}>
          <label htmlFor="username">
            <span className={styles.titleInput}>Username</span>
            <input
              value={cirrentUserData.username || ""}
              type="text"
              name="username"
              {...register("username")}
              onChange={handleInputChange}
              className={styles.input}
            />
            {error?.username && (
              <span className={styles.incorrectData}>{error?.username}</span>
            )}
          </label>
        </div>
        <div className={styles.labelContainer}>
          <label htmlFor="email">
            <span className={styles.titleInput}>Email address</span>
            <input
              value={cirrentUserData.email || ""}
              type="email"
              name="email"
              {...register("email")}
              onChange={handleInputChange}
              className={styles.input}
            />
            {error?.email && (
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
              {...register("password", {
                minLength: {
                  value: 6,
                  message: "Too short password",
                },
                maxLength: {
                  value: 40,
                  message: "Too long password",
                },
              })}
              className={styles.input}
            />
            {errors?.password && (
              <span className={styles.incorrectData}>
                {errors?.password?.message}
              </span>
            )}
          </label>
        </div>
        <div className={styles.labelContainer}>
          <label htmlFor="imageUrl">
            <span className={styles.titleInput}>Avatar image (url)</span>
            <input
              value={cirrentUserData.image || ""}
              type="text"
              name="imageUrl"
              {...register("imageUrl", {
                pattern: {
                  value: /^(ftp|http|https):\/\/[^ "]+$/,
                  message: "Enter a valid image link",
                },
              })}
              className={styles.input}
            />
            {errors.imageUrl && (
              <span className={styles.incorrectData}>
                {errors.imageUrl.message}
              </span>
            )}
          </label>
        </div>
        <button
          type="submit"
          className={`${styles.submitButton} ${loading ? styles.loading : ""}`}
          disabled={!isValid || loading}
        >
          <span style={{ display: loading ? "none" : "inline" }}>
            Confirm edit profile
          </span>
        </button>
      </form>
    </div>
  )
}

export default EditProfileForm
