/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect, useRef } from "react"
import _ from "lodash"
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5"
import { format } from "date-fns"
import ReactMarkdown from "react-markdown"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchDeleteArticle,
  fetchLikeArticle,
  fetchLikeDelete,
} from "../../store/articlesSlice"
import { message, Popconfirm } from "antd"
import { useNavigate, Link } from "react-router-dom"
import { selectIsAuth } from "../../store/authSlice"
import axios from "axios"
import { getArticle } from "../../service/config"
import PropTypes from "prop-types"
import styles from "./Info.module.scss"

function Info(props) {
  const {
    author,
    body,
    createdAt,
    description,
    tagList,
    title,
    slug,
    onClick,
  } = props

  const wrapperRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    function handleResize() {
      if (wrapperRef.current) {
        setHeight(wrapperRef.current.offsetHeight)
      }
    }

    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const data = JSON.parse(localStorage.getItem("data"))

  const isAuthor = () => {
    const authorName = data?.user?.username
    return author?.username === authorName
  }
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const confirm = () => {
    dispatch(fetchDeleteArticle(slug))
    navigate("/")
  }
  const cancel = () => {
    message.error("Click on No")
  }

  const isAuth = useSelector(selectIsAuth)

  const [article, setArticle] = useState(null)
  const [likeCount, setLikeCount] = useState(article?.favoritesCount)
  const [isLiked, setIsLiked] = useState(
    localStorage.getItem(`like_${slug}`) === "true"
  )

  const handleLikeClick = () => {
    if (isAuth) {
      if (!isLiked) {
        setLikeCount(likeCount + 1)
        setIsLiked(true)
        localStorage.setItem(`like_${slug}`, true)
        dispatch(fetchLikeArticle(slug)).then(() => {
          setArticle((prevState) => ({
            ...prevState,
            favoritesCount: prevState.favoritesCount + 1,
          }))
        })
      } else {
        setLikeCount(likeCount - 1)
        setIsLiked(false)
        localStorage.removeItem(`like_${slug}`)
        dispatch(fetchLikeDelete(slug)).then(() => {
          setArticle((prevState) => ({
            ...prevState,
            favoritesCount: prevState.favoritesCount - 1,
          }))
        })
      }
    } else {
      navigate.push("/")
    }
  }

  useEffect(() => {
    axios.get(getArticle(slug)).then(() => setArticle(data.article))
  }, [])

  useEffect(() => {
    localStorage.setItem("slug", slug)
  }, [slug])

  return (
    <article
      className={`${styles.wrapper} ${height > 600 && styles.height}`}
      ref={wrapperRef}
    >
      <div className={styles.cardContainer}>
        <div className={styles.cardLeft}>
          <div className={styles.titleContainer}>
            <span className={styles.cardTitle} onClick={onClick}>
              {title.length > 30 ? _.truncate(title, { length: 30 }) : title}
            </span>
            <span className={styles.likeContainer} onClick={handleLikeClick}>
              {isLiked ? <IoHeartSharp color="red" /> : <IoHeartOutline />}
              <span className={styles.likeCount}>
                {article?.favoritesCount}
              </span>
            </span>
          </div>
          <div className={styles.cardTags}>
            {tagList?.map((el, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <span className={styles.tag} key={i + el}>
                {el}
              </span>
            ))}
          </div>
          <span className={styles.cardDescription}>{description}</span>
        </div>
        <div className={styles.cardRight}>
          <div className={styles.cardContainerRight}>
            <span className={styles.cardAuthor}>{author.username}</span>
            <span className={styles.cardDate}>
              {createdAt ? format(new Date(createdAt), "MMM dd, yyyy") : null}
            </span>
          </div>
          <img
            className={styles.cardImage}
            src={author.image ? author.image : null}
            alt={author.image}
          />
        </div>
      </div>
      <div className={styles.cardBody}>
        <ReactMarkdown>{body}</ReactMarkdown>
      </div>
      {isAuthor() ? (
        <div className={styles.buttonContainer}>
          <Popconfirm
            title="Delete Article"
            description="Are you sure to delete this article?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
            placement="right"
          >
            <button className={styles.deleteButton}>Delete</button>
          </Popconfirm>
          <Link className={styles.editButton} to={`/articles/${slug}/edit`}>
            Edit
          </Link>
        </div>
      ) : null}
    </article>
  )
}

Info.defaultProps = {
  author: {},
  createdAt: "",
  tagList: [],
  onClick: () => {},
}

Info.propTypes = {
  author: PropTypes.shape({
    username: PropTypes.string.isRequired,
    image: PropTypes.string,
  }),
  body: PropTypes.string.isRequired,
  createdAt: PropTypes.string,
  description: PropTypes.string.isRequired,
  tagList: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  onClick: PropTypes.func,
}

export default Info
