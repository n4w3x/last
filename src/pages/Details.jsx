/* eslint-disable react/jsx-props-no-spreading */
import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getArticle } from "../service/config"
import Info from "../components/Info/Info"
import { Skeleton } from "antd"

function Details() {
  const [article, setArticle] = useState(null)
  const { push } = useNavigate()
  const { slug } = useParams()

  useEffect(() => {
    axios.get(getArticle(slug)).then(({ data }) => setArticle(data.article))
  }, [slug])

  return (
    <div>
      {article ? (
        <Info push={push} {...article} />
      ) : (
        <Skeleton style={{ marginTop: "20px" }} />
      )}
    </div>
  )
}

export default Details
