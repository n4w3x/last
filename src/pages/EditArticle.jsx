/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-props-no-spreading */
import { useSelector, useDispatch } from "react-redux"
import { useForm, useFieldArray } from "react-hook-form"
import { selectIsAuth } from "../store/authSlice"
import { Navigate, useNavigate } from "react-router-dom"
import { fetchEditArticle } from "../store/articlesSlice"

import { useState, useEffect } from "react"
import { BASE_URL } from "../service/config"
import axios from "axios"
import styles from "./EditArticle.module.scss"

function EditArticle() {
  const [titleInput, setTitleInput] = useState("")
  const [shortInput, setShortInput] = useState("")
  const [bodyInput, setBodyInput] = useState("")
  const [tagsInput, setTagsInput] = useState([])
  const isAuth = useSelector(selectIsAuth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      tags: [...tagsInput],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags",
    rules: {
      required: "Please append at least 1 item",
    },
  })

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token")
      const slug = localStorage.getItem("slug")
      const response = await axios.get(`${BASE_URL}articles/${slug}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      setTitleInput(response?.data.article?.title)
      setShortInput(response?.data.article?.description)
      setBodyInput(response?.data.article?.body)
      setTagsInput(response?.data.article?.tagList || [])
    }
    fetchData()
  }, [])

  const onSubmit = (data) => {
    setLoading(true)
    const slug = localStorage.getItem("slug")

    const payload = {
      slug,
      userData: {
        article: {
          title: data.title,
          description: data.description,
          body: data.textarea,
          tagList: data.tags.map((el) => el.name),
        },
      },
    }

    dispatch(
      fetchEditArticle(payload)
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.errors
          ) {
            console.log(error.response.data.errors)
          } else {
            console.log("An error occurred while processing your request.")
          }
        })
        .finally(() => {
          setLoading(false)
        })
    )
    navigate(`/`)
  }
  if (!isAuth && !localStorage.getItem("token")) {
    return <Navigate to="/sign-in" replace />
  }

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>Edit article</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.labelContainer}>
          <label htmlFor="username">
            <span className={styles.titleInput}>Title</span>
            <input
              value={titleInput}
              type="text"
              name="title"
              className={styles.input}
              {...register("title", {
                required: "The field is required",
              })}
              onChange={(e) => setTitleInput(e.target.value)}
            />
            {errors?.title && (
              <div className={styles.incorrectData}>
                {errors?.title?.message}
              </div>
            )}
          </label>
        </div>
        <div className={styles.labelContainer}>
          <label htmlFor="username">
            <span className={styles.titleInput}>Short description</span>
            <input
              value={shortInput}
              type="text"
              name="description"
              className={styles.input}
              {...register("description", {
                required: "The field is required",
              })}
              onChange={(e) => setShortInput(e.target.value)}
            />
            {errors?.description && (
              <div className={styles.incorrectData}>
                {errors?.description?.message}
              </div>
            )}
          </label>
        </div>
        <div className={styles.labelContainer}>
          <label htmlFor="textarea">
            <span className={styles.titleInput}>Description</span>
            <textarea
              value={bodyInput}
              type="text"
              name="textarea"
              className={styles.textInput}
              {...register("textarea", {
                required: "The field is required",
              })}
              onChange={(e) => setBodyInput(e.target.value)}
            />
            {errors?.textarea && (
              <div className={styles.incorrectData}>
                {errors?.textarea?.message}
              </div>
            )}
          </label>
        </div>
        <div>
          <span className={styles.titleTag}>Title</span>
        </div>
        {fields.length > 0 ? (
          fields.map((field, index) => (
            <section key={field.id}>
              <label htmlFor={`tags.${index}.name`}>
                <input
                  type="text"
                  name={`tags.${index}.name`}
                  className={styles.tagInput}
                  {...register(`tags.${index}.name`, {})}
                />
              </label>
              <button
                type="button"
                onClick={() => remove(index)}
                className={styles.buttonDeleteTag}
              >
                Delete Tag
              </button>
              {index === fields.length - 1 && (
                <button
                  type="button"
                  onClick={() => append({ name: "" })}
                  className={styles.buttonAddTag}
                >
                  Add Tag
                </button>
              )}
              {index === fields.length - 1 && field.name === "" && (
                <div className={styles.incorrectData}>
                  Перед отправкой формы, убедитесь что поле не пустое.
                </div>
              )}
            </section>
          ))
        ) : (
          <button
            type="button"
            onClick={() => append({ name: "" })}
            className={styles.buttonAddTag}
          >
            Add Tag
          </button>
        )}
        <button
          type="submit"
          className={`${styles.submitButton} ${loading ? styles.loading : ""}`}
          disabled={!isValid || loading}
        >
          <span style={{ display: loading ? "none" : "inline" }}>
            Confirm edit
          </span>
        </button>
      </form>
    </div>
  )
}

export default EditArticle
