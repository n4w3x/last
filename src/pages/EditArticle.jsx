import { useForm, useFieldArray } from "react-hook-form"
import { useNavigate, useParams, Navigate } from "react-router-dom"
import { useEffect } from "react"
import {
  useEditArticleMutation,
  useFetchArticleQuery,
} from "../service/apiSlice"
import { useFetchCurrentUserQuery } from "../service/authApiSlice"
import styles from "./EditArticle.module.scss"

function EditArticle() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const { data: authData, isLoading: isAuthLoading } =
    useFetchCurrentUserQuery()
  const isAuth = Boolean(authData?.user)

  const {
    data,
    isLoading: isArticleLoading,
    error,
  } = useFetchArticleQuery(slug, { refetchOnMountOrArgChange: true })
  const [editArticle, { isLoading: isEditing }] = useEditArticleMutation()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      body: "",
      tagList: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tagList",
  })

  useEffect(() => {
    if (data?.article) {
      reset({
        title: data.article.title,
        description: data.article.description,
        body: data.article.body,
        tagList: data.article.tagList.map((tag) => ({ name: tag })),
      })
    }
  }, [data, reset])

  const onSubmit = async (formData) => {
    const filteredTags = formData.tagList
      .map((t) => t.name.trim())
      .filter((name) => name.length > 0)

    try {
      await editArticle({
        slug,
        userData: {
          article: {
            title: formData.title,
            description: formData.description,
            body: formData.body,
            tagList: filteredTags,
          },
        },
      }).unwrap()

      navigate(`/articles/${slug}`)
    } catch (e) {
      console.error("Failed to edit article:", e)
      alert("Error editing article")
    }
  }

  if (!isAuthLoading && !isAuth && !localStorage.getItem("token")) {
    return <Navigate to="/sign-in" replace />
  }

  if (isArticleLoading) return <div>Loading article...</div>
  if (error) return <div>Error loading article</div>

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>Edit article</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.labelContainer}>
          <label>
            <span className={styles.titleInput}>Title</span>
            <input
              className={styles.input}
              {...register("title", { required: "Title is required" })}
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
              className={styles.input}
              {...register("description", {
                required: "Description is required",
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
              className={styles.textInput}
              {...register("body", { required: "Body is required" })}
            />
            {errors.body && (
              <div className={styles.incorrectData}>{errors.body.message}</div>
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
                {...register(`tagList.${index}.name`)}
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
          className={`${styles.submitButton} ${isEditing ? styles.loading : ""}`}
          disabled={isEditing}
        >
          <span style={{ display: isEditing ? "none" : "inline" }}>
            Confirm edit
          </span>
        </button>
      </form>
    </div>
  )
}

export default EditArticle
