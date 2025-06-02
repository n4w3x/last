/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useRef, useState, useEffect } from "react"
import _ from "lodash"
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5"
import { format } from "date-fns"
import ReactMarkdown from "react-markdown"
import { message, Popconfirm } from "antd"
import { useNavigate, Link } from "react-router-dom"
import PropTypes from "prop-types"

import {
  useDeleteArticleMutation,
  useLikeArticleMutation,
  useUnlikeArticleMutation,
} from "../../service/apiSlice"

import styles from "./Info.module.scss"

function Info({
  author,
  body,
  createdAt,
  description,
  tagList,
  title,
  slug,
  onClick,
  favorited,
  favoritesCount,
  refetch,
}) {
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

  const [deleteArticle] = useDeleteArticleMutation()
  const [likeArticle] = useLikeArticleMutation()
  const [unlikeArticle] = useUnlikeArticleMutation()
  const navigate = useNavigate()
  const isAuth = Boolean(localStorage.getItem("token"))

  const [isLiked, setIsLiked] = useState(favorited)
  const [likeCount, setLikeCount] = useState(favoritesCount || 0)

  useEffect(() => {
    setIsLiked(favorited)
    setLikeCount(favoritesCount || 0)
  }, [favorited, favoritesCount])

  const currentUser = JSON.parse(localStorage.getItem("data"))?.user
  const isAuthor = currentUser?.username === author?.username

  const handleDeleteConfirm = async () => {
    try {
      await deleteArticle(slug).unwrap()
      message.success("Article deleted")
      navigate("/")
    } catch (err) {
      message.error("Failed to delete article")
    }
  }

  const handleLikeClick = async () => {
    if (!isAuth) {
      navigate("/sign-in")
      return
    }

    try {
      if (!isLiked) {
        await likeArticle(slug).unwrap()
        setIsLiked(true)
        setLikeCount((count) => count + 1)
      } else {
        await unlikeArticle(slug).unwrap()
        setIsLiked(false)
        setLikeCount((count) => Math.max(0, count - 1))
      }

      if (refetch) {
        refetch()
      }
    } catch (err) {
      message.error("Failed to update like status")
    }
  }

  return (
    <article
      className={`${styles.wrapper} ${height > 600 ? styles.height : ""}`}
      ref={wrapperRef}
    >
      <div className={styles.cardContainer}>
        <div className={styles.cardLeft}>
          <div className={styles.titleContainer}>
            <span className={styles.cardTitle} onClick={onClick}>
              {title.length > 30 ? _.truncate(title, { length: 30 }) : title}
            </span>
            <span
              className={styles.likeContainer}
              onClick={handleLikeClick}
              style={{ cursor: "pointer" }}
            >
              {isLiked ? <IoHeartSharp color="red" /> : <IoHeartOutline />}
              <span className={styles.likeCount}>{likeCount}</span>
            </span>
          </div>
          <div className={styles.cardTags}>
            {tagList?.map((tag, i) => (
              <span className={styles.tag} key={tag + i}>
                {tag}
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
            src={author.image || undefined}
            alt={author.username}
          />
        </div>
      </div>
      <div className={styles.cardBody}>
        <ReactMarkdown>{body}</ReactMarkdown>
      </div>

      {isAuthor && (
        <div className={styles.buttonContainer}>
          <Popconfirm
            title="Delete Article"
            description="Are you sure to delete this article?"
            onConfirm={handleDeleteConfirm}
            onCancel={() => message.info("Delete cancelled")}
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
      )}
    </article>
  )
}

Info.defaultProps = {
  author: {},
  createdAt: "",
  tagList: [],
  onClick: () => {},
  refetch: null,
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
  favorited: PropTypes.bool.isRequired,
  favoritesCount: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  refetch: PropTypes.func,
}

export default Info
