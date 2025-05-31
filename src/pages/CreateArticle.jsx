import React from "react"
import { useNavigate, Navigate } from "react-router-dom"
import { useForm, useFieldArray } from "react-hook-form"
import { useFetchCurrentUserQuery } from "../service/authApiSlice"
import { useCreateArticleMutation } from "../service/apiSlice"

import styles from "./CreateArticle.module.scss"

function CreateArticle() {
  const navigate = useNavigate()

  const { data: userData, isLoading: isUserLoading } =
    useFetchCurrentUserQuery()
  const isAuth = Boolean(userData?.user)

  const [createArticle, { isLoading }] = useCreateArticleMutation()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      body: "",
      tagList: [{ name: "" }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tagList",
  })
  const onSubmit = async (data) => {
    const filteredTags = data.tagList
      .map((t) => t.name.trim())
      .filter((name) => name.length > 0)

    if (filteredTags.length === 0) {
      alert("Please add at least one tag")
      return
    }

    try {
      const articleData = {
        article: {
          title: data.title,
          description: data.description,
          body: data.body,
          tagList: filteredTags,
        },
      }

      const { article } = await createArticle(articleData).unwrap()
      navigate(`/articles/${article.slug}`)
    } catch (error) {
      console.error("Failed to create article:", error)
      alert("Error creating article")
    }
  }

  if (!isUserLoading && !isAuth && !localStorage.getItem("token")) {
    return <Navigate to="/sign-in" replace />
  }

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>Create new article</h3>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.labelContainer}>
          <label>
            <span className={styles.titleInput}>Title</span>
            <input
              type="text"
              className={`${styles.input} ${errors.title ? styles.invalidInput : ""}`}
              {...register("title", {
                required: "Title is required",
                minLength: { value: 5, message: "Min length is 5" },
                maxLength: { value: 100, message: "Max length is 100" },
              })}
            />
            {errors.title && (
              <div className={styles.incorrectData}>{errors.title.message}</div>
            )}
          </label>
        </div>

        <div className={styles.labelContainer}>
          <label>
            <span className={styles.titleInput}>Short description</span>
            <input
              type="text"
              className={`${styles.input} ${errors.description ? styles.invalidInput : ""}`}
              {...register("description", {
                required: "Description is required",
                minLength: { value: 5, message: "Min length is 5" },
                maxLength: { value: 150, message: "Max length is 150" },
              })}
            />
            {errors.description && (
              <div className={styles.incorrectData}>
                {errors.description.message}
              </div>
            )}
          </label>
        </div>

        <div className={styles.labelContainer}>
          <label>
            <span className={styles.titleInput}>Description</span>
            <textarea
              className={`${styles.textInput} ${errors.body ? styles.invalidInput : ""}`}
              {...register("body", { required: "Body is required" })}
            />
            {errors.body && (
              <div className={styles.incorrectData}>{errors.body.message}</div>
            )}
          </label>
        </div>

        {fields.map((field, index) => (
          <section key={field.id} className={styles.tagSection}>
            <label>
              <input
                type="text"
                className={styles.tagInput}
                {...register(`tagList.${index}.name`)}
                placeholder="Tag"
              />
            </label>
            <button
              type="button"
              className={styles.buttonDeleteTag}
              onClick={() => remove(index)}
            >
              Delete Tag
            </button>
            {index === fields.length - 1 && (
              <button
                type="button"
                className={styles.buttonAddTag}
                onClick={() => append({ name: "" })}
              >
                Add Tag
              </button>
            )}
          </section>
        ))}

        <button
          type="submit"
          className={`${styles.submitButton} ${isLoading ? styles.loading : ""}`}
          disabled={isLoading}
        >
          <span style={{ display: isLoading ? "none" : "inline" }}>Create</span>
        </button>
      </form>
    </div>
  )
}

export default CreateArticle
