import { useSelector, useDispatch } from "react-redux"
import { useForm, useFieldArray } from "react-hook-form"
import { selectIsAuth } from "../store/authSlice"
import { Navigate, useNavigate } from "react-router-dom"
import { fetchEditArticle } from "../store/articlesSlice"

import { useEffect, useState } from "react"
import { BASE_URL } from "../service/config"
import axios from "axios"
import styles from "./EditArticle.module.scss"

function EditArticle() {
  const isAuth = useSelector(selectIsAuth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      title: "",
      description: "",
      textarea: "",
      tags: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags",
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token")
        const slug = localStorage.getItem("slug")
        const response = await axios.get(`${BASE_URL}articles/${slug}`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        })

        const article = response?.data?.article

        reset({
          title: article.title,
          description: article.description,
          textarea: article.body,
          tags: article.tagList.map((tag) => ({ name: tag })),
        })
      } catch (err) {
        console.error("Ошибка при получении статьи:", err)
      }
    }

    fetchData()
  }, [reset])

  const onSubmit = async (data) => {
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

    try {
      await dispatch(fetchEditArticle(payload)).unwrap()
      navigate("/")
    } catch (error) {
      console.error("Ошибка при редактировании статьи:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuth && !localStorage.getItem("token")) {
    return <Navigate to="/sign-in" replace />
  }

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>Edit article</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.labelContainer}>
          <label>
            <span className={styles.titleInput}>Title</span>
            <input
              type="text"
              className={styles.input}
              {...register("title", { required: "The field is required" })}
            />
            {errors?.title && (
              <div className={styles.incorrectData}>{errors.title.message}</div>
            )}
          </label>
        </div>

        <div className={styles.labelContainer}>
          <label>
            <span className={styles.titleInput}>Short description</span>
            <input
              type="text"
              className={styles.input}
              {...register("description", {
                required: "The field is required",
              })}
            />
            {errors?.description && (
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
              className={styles.textInput}
              {...register("textarea", { required: "The field is required" })}
            />
            {errors?.textarea && (
              <div className={styles.incorrectData}>
                {errors.textarea.message}
              </div>
            )}
          </label>
        </div>

        <div>
          <span className={styles.titleTag}>Tags</span>
        </div>
        {fields.map((field, index) => (
          <section key={field.id}>
            <label>
              <input
                type="text"
                className={styles.tagInput}
                {...register(`tags.${index}.name`)}
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
          </section>
        ))}
        {fields.length === 0 && (
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
