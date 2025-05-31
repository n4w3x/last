import React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useFetchArticleQuery } from "../service/apiSlice"
import Info from "../components/Info/Info"
import { Skeleton } from "antd"

function Details() {
  const navigate = useNavigate()
  const { slug } = useParams()

  const { data, isLoading, isError, error, refetch } =
    useFetchArticleQuery(slug)

  if (isLoading) return <Skeleton style={{ marginTop: "20px" }} />
  if (isError) {
    console.error("Failed to fetch article:", error)
    return (
      <div style={{ marginTop: "20px", color: "red" }}>
        Error loading article
      </div>
    )
  }

  const article = data?.article

  return (
    <div>
      {article ? (
        <Info {...article} refetch={refetch} />
      ) : (
        <div style={{ marginTop: "20px" }}>Article not found</div>
      )}
    </div>
  )
}

export default Details
