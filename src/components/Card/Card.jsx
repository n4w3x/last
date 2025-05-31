/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from "react"
import PropTypes from "prop-types"
import { format } from "date-fns"
import _ from "lodash"
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  useLikeArticleMutation,
  useUnlikeArticleMutation,
  apiSlice,
} from "../../service/apiSlice"
import styles from "./Card.module.scss"

function Card({
  username,
  img,
  title,
  date,
  description,
  tags,
  likesNumber,
  favorited,
  onClick,
  slug,
}) {
  const isAuth = Boolean(localStorage.getItem("token"))
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [likeArticle] = useLikeArticleMutation()
  const [unlikeArticle] = useUnlikeArticleMutation()

  const [localFavorited, setLocalFavorited] = useState(favorited)
  const [localLikes, setLocalLikes] = useState(likesNumber)

  const handleLikeClick = async () => {
    if (!isAuth) {
      navigate("/sign-in")
      return
    }

    try {
      if (!localFavorited) {
        await likeArticle(slug).unwrap()
        setLocalFavorited(true)
        setLocalLikes((prev) => prev + 1)
      } else {
        await unlikeArticle(slug).unwrap()
        setLocalFavorited(false)
        setLocalLikes((prev) => prev - 1)
      }

      dispatch(apiSlice.util.invalidateTags([{ type: "Article", id: slug }]))
    } catch (err) {
      console.error("Ошибка лайка/дизлайка:", err)
    }
  }

  return (
    <article className={styles.wrapper}>
      <div className={styles.cardLeft}>
        <div className={styles.titleContainer}>
          <span className={styles.cardTitle} onClick={onClick}>
            {title.length > 30 ? _.truncate(title, { length: 30 }) : title}
          </span>
          <span className={styles.likeContainer} onClick={handleLikeClick}>
            {localFavorited ? (
              <IoHeartSharp color={styles.red} />
            ) : (
              <IoHeartOutline />
            )}
            <span className={styles.likeCount}>{localLikes}</span>
          </span>
        </div>
        <div className={styles.cardTags}>
          {tags?.map((el, i) => (
            <span className={styles.tag} key={i}>
              {el}
            </span>
          ))}
        </div>
        <span className={styles.cardDescription}>
          {description.length > 15
            ? _.truncate(description, { length: 75 })
            : description}
        </span>
      </div>
      <div className={styles.cardRight}>
        <div className={styles.cardContainerRight}>
          <span className={styles.cardAuthor}>
            {username.length > 15
              ? _.truncate(username, { length: 15 })
              : username}
          </span>
          <span className={styles.cardDate}>
            {date ? format(new Date(date), "MMM dd, yyyy") : null}
          </span>
        </div>
        <img className={styles.cardImage} src={img || null} alt={username} />
      </div>
    </article>
  )
}

Card.propTypes = {
  username: PropTypes.string.isRequired,
  img: PropTypes.string,
  title: PropTypes.string.isRequired,
  date: PropTypes.string,
  description: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  likesNumber: PropTypes.number.isRequired,
  favorited: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  slug: PropTypes.string.isRequired,
}

Card.defaultProps = {
  tags: [],
  date: "no data",
  img: "https://static.productionready.io/images/smiley-cyrus.jpg",
}

export default Card
