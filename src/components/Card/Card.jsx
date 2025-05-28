/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from "react"
import PropTypes from "prop-types"
import { format } from "date-fns"
import _ from "lodash"
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5"
import { fetchLikeArticle, fetchLikeDelete } from "../../store/articlesSlice"
import { useDispatch, useSelector } from "react-redux"
import { selectIsAuth } from "../../store/authSlice"
import { useNavigate } from "react-router-dom"
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
  const dispatch = useDispatch()
  const isAuth = useSelector(selectIsAuth)
  const navigate = useNavigate()
  const handleLikeClick = () => {
    if (isAuth) {
      if (!favorited) {
        dispatch(fetchLikeArticle(slug))
      } else {
        dispatch(fetchLikeDelete(slug))
      }
    } else {
      navigate("/")
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
            {favorited ? (
              <IoHeartSharp color={styles.red} />
            ) : (
              <IoHeartOutline />
            )}
            <span className={styles.likeCount}>{likesNumber}</span>
          </span>
        </div>
        <div className={styles.cardTags}>
          {tags?.map((el, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <span className={styles.tag} key={i}>
              {el}
            </span>
          ))}
        </div>
        <span className={styles.cardDescription}>
          {" "}
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
