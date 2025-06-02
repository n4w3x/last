import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

import {
  useEditUserMutation,
  useFetchCurrentUserQuery,
} from "../service/authApiSlice"

import styles from "./EditProfileForm.module.scss"

function EditProfileForm() {
  const navigate = useNavigate()

  const { data, isLoading, error: fetchError } = useFetchCurrentUserQuery()

  const [editUser, { isLoading: isEditing, error: editError }] =
    useEditUserMutation()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onBlur",
  })

  useEffect(() => {
    if (data?.user) {
      setValue("username", data.user.username || "")
      setValue("email", data.user.email || "")
      setValue("imageUrl", data.user.image || "")
      setValue("password", "")
    }
  }, [data, setValue])

  const email = watch("email")

  useEffect(() => {
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      /* empty */
    }
  }, [email])

  const onSubmit = async (formData) => {
    try {
      const userData = {
        user: {
          username: formData.username,
          email: formData.email,
          image: formData.imageUrl,
          password: formData.password || undefined,
        },
      }

      await editUser(userData).unwrap()
      navigate("/")
    } catch (err) {
      console.error("Failed to update user:", err)
    }
  }

  if (isLoading) return <div>Loading user data...</div>
  if (fetchError) return <div>Error loading user data</div>

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>Edit Profile</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.labelContainer}>
          <label htmlFor="username">
            <span className={styles.titleInput}>Username</span>
            <input
              type="text"
              {...register("username", { required: "Username is required" })}
              className={styles.input}
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
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Invalid email address",
                },
              })}
              className={styles.input}
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
            {errors.password && (
              <span className={styles.incorrectData}>
                {errors.password.message}
              </span>
            )}
          </label>
        </div>

        <div className={styles.labelContainer}>
          <label htmlFor="imageUrl">
            <span className={styles.titleInput}>Avatar image (url)</span>
            <input
              type="text"
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

        {editError && (
          <div className={styles.incorrectData}>
            {editError.data?.errors
              ? Object.entries(editError.data.errors)
                  .map(
                    ([field, messages]) => `${field}: ${messages.join(", ")}`
                  )
                  .join("; ")
              : "Failed to update user."}
          </div>
        )}

        <button
          type="submit"
          className={`${styles.submitButton} ${isEditing ? styles.loading : ""}`}
          disabled={!isValid || isEditing}
        >
          <span style={{ display: isEditing ? "none" : "inline" }}>
            Confirm edit profile
          </span>
        </button>
      </form>
    </div>
  )
}

export default EditProfileForm
