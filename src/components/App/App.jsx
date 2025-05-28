import React, { useState, useEffect } from "react"
import Header from "../Header/Header"
import Main from "../Main/Main"
import { Routes, Route, Navigate, useParams } from "react-router-dom"
import HomePage from "../../pages/HomePage"
import Details from "../../pages/Details"
import LoginForm from "../../pages/LoginForm"
import RegistrationForm from "../../pages/RegistrationForm"
import EditProfileForm from "../../pages/EditProfileForm"
import CreateArticle from "../../pages/CreateArticle"
import EditArticle from "../../pages/EditArticle"
import { useSelector } from "react-redux"
import { selectAuthData, selectAuthStatus } from "../../store/authSlice"
import { Alert } from "antd"
import { getArticle } from "../../service/config"
import axios from "axios"

function App() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const currentUser = useSelector(selectAuthData)
  const isAuthor = () => currentUser?.username === article?.author?.username
  const status = useSelector(selectAuthStatus)
  const error = status === "rejected" && (
    <Alert
      message="Произошла ошибка. Мы уже работаем над этим."
      type="error"
      showIcon
    />
  )

  useEffect(() => {
    if (slug) {
      axios.get(getArticle(slug)).then(({ data }) => {
        setArticle(data.article)
      })
    }
  }, [slug])
  return (
    <>
      <Header />
      <Main>
        {error}
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/articles/:slug/edit"
            element={isAuthor() ? <EditArticle /> : <Navigate to="/" replace />}
          />

          <Route path="/articles/:slug" element={<Details />} />

          <Route path="/new-article" element={<CreateArticle />} />

          <Route path="/sign-in" element={<LoginForm />} />

          <Route path="/sign-up" element={<RegistrationForm />} />

          <Route path="/profile" element={<EditProfileForm />} />
        </Routes>
      </Main>
    </>
  )
}

export default App
