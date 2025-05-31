import React from "react"
import Header from "../Header/Header"
import Main from "../Main/Main"
import { Routes, Route } from "react-router-dom"
import HomePage from "../../pages/HomePage"
import Details from "../../pages/Details"
import LoginForm from "../../pages/LoginForm"
import RegistrationForm from "../../pages/RegistrationForm"
import EditProfileForm from "../../pages/EditProfileForm"
import CreateArticle from "../../pages/CreateArticle"
import EditArticle from "../../pages/EditArticle"
import { useFetchCurrentUserQuery } from "../../service/authApiSlice"
import { Alert } from "antd"

function App() {
  const token = localStorage.getItem("token")
  const { isError, error } = useFetchCurrentUserQuery(undefined, {
    skip: !token,
  })

  return (
    <>
      <Header />
      <Main>
        {isError && (
          <Alert
            message="Произошла ошибка. Мы уже работаем над этим."
            description={error?.data?.message || ""}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/articles/:slug" element={<Details />} />
          <Route path="/articles/:slug/edit" element={<EditArticle />} />
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
