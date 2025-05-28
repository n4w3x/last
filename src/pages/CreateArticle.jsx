/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useForm, useFieldArray } from "react-hook-form"
import { useNavigate, Navigate } from "react-router-dom"
import { selectIsAuth } from "../store/authSlice"
import { fetchCreateArticle } from "../store/articlesSlice"
import styles from "./CreateArticle.module.scss"

function CreateArticle() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isAuth = useSelector(selectIsAuth)
  const [loading, setLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [textarea, setTextarea] = useState("")
  const [tags, setTags] = useState([])
  const [titleError, setTitleError] = useState(null)
  const [descriptionError, setDescriptionError] = useState(null)
  const [textareaError, setTextareaError] = useState(null)
  const [tagsError, setTagsError] = useState(null)

  const handleTitleChange = (e) => {
    setTitle(e.target.value)
    setTitleError(null)
  }

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value)
    setDescriptionError(null)
  }

  const handleTextareaChange = (e) => {
    setTextarea(e.target.value)
    setTextareaError(null)
  }

  const handleTagChange = (index, value) => {
    const newTags = [...tags]
    newTags[index].name = value
    setTags(newTags)
    setTagsError(null)
  }

  const handleAddTag = () => {
    setTags([...tags, { name: "" }])
  }

  const handleRemoveTag = (index) => {
    const newTags = [...tags]
    newTags.splice(index, 1)
    setTags(newTags)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitted(true)

    let hasErrors = false

    if (title.length < 5) {
      setTitleError("Title must  exceed 5 characters")
      hasErrors = true
    }

    if (title.length > 100) {
      setTitleError("Title must not exceed 100 characters")
      hasErrors = true
    }

    if (description.length < 5) {
      setDescriptionError("Description must exceed 1 characters")
      hasErrors = true
    }

    if (description.length > 25) {
      setDescriptionError("Description must not exceed 150 characters")
      hasErrors = true
    }

    if (!textarea) {
      setTextareaError("The field is required")
      hasErrors = true
    }

    if (tags.length === 0) {
      setTagsError("Please append at least 1 item")
      hasErrors = true
    }

    if (hasErrors) {
      return
    }

    setLoading(true)

    try {
      const userData = {
        article: {
          title,
          description,
          body: textarea,
          tagList: tags.map((el) => el.name),
        },
      }
      const response = await dispatch(fetchCreateArticle(userData))
      localStorage.setItem("slug", response.payload.slug)
      navigate(`/articles/${response.payload.slug}`)
      localStorage.removeItem("slug")
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setTimeout(() => {
        setLoading(false)
        setIsSubmitted(false)
      }, 0)
    }
  }

  if (!isAuth && !localStorage.getItem("token")) {
    return <Navigate to="/sign-in" replace />
  }

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>Create new article</h3>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.labelContainer}>
          <label htmlFor="username">
            <span className={styles.titleInput}>Title</span>
            <input
              type="text"
              name="title"
              className={`${styles.input} ${isSubmitted && titleError ? styles.invalidInput : ""}`}
              value={title}
              onChange={handleTitleChange}
            />
            {isSubmitted && titleError && (
              <div className={styles.incorrectData}>{titleError}</div>
            )}
          </label>
        </div>
        <div className={styles.labelContainer}>
          <label htmlFor="username">
            <span className={styles.titleInput}>Short description</span>
            <input
              type="text"
              name="description"
              className={`${styles.input} ${
                isSubmitted && descriptionError ? styles.invalidInput : ""
              }`}
              value={description}
              onChange={handleDescriptionChange}
            />
            {isSubmitted && descriptionError && (
              <div className={styles.incorrectData}>{descriptionError}</div>
            )}
          </label>
        </div>
        <div className={styles.labelContainer}>
          <label htmlFor="textarea">
            <span className={styles.titleInput}>Description</span>
            <textarea
              type="text"
              name="textarea"
              className={styles.textInput}
              value={textarea}
              onChange={handleTextareaChange}
            />
            {isSubmitted && textareaError && (
              <div className={styles.incorrectData}>{textareaError}</div>
            )}
          </label>
        </div>
        {tags.length > 0 ? (
          tags.map((field, index) => (
            <section key={index}>
              <label htmlFor={`tags.${index}.name`}>
                <input
                  type="text"
                  name={`tags.${index}.name`}
                  className={styles.tagInput}
                  value={field.name}
                  onChange={(e) => handleTagChange(index, e.target.value)}
                />
              </label>
              <button
                type="button"
                className={styles.buttonDeleteTag}
                onClick={() => {
                  handleRemoveTag(index)
                }}
              >
                Delete Tag
              </button>
              {index === tags.length - 1 && (
                <button
                  type="button"
                  className={styles.buttonAddTag}
                  onClick={handleAddTag}
                >
                  Add Tag
                </button>
              )}
              {index === tags.length - 1 && field.name === "" && (
                <div className={styles.warningData}>
                  Перед отправкой формы, убедитесь что поле не пустое.
                </div>
              )}
            </section>
          ))
        ) : (
          <button
            type="button"
            className={styles.buttonAddTag}
            onClick={handleAddTag}
          >
            Add Tag
          </button>
        )}
        {isSubmitted && tagsError && (
          <div className={styles.incorrectData}>{tagsError}</div>
        )}
        <button
          type="submit"
          className={`${styles.submitButton} ${loading ? styles.loading : ""}`}
          disabled={loading}
        >
          <span style={{ display: loading ? "none" : "inline" }}>Create</span>
        </button>
      </form>
    </div>
  )
}

export default CreateArticle
