import React, { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import { Alert } from "antd"

import Header from "../Header/Header"
import Main from "../Main/Main"
import HomePage from "../../pages/HomePage"
import Details from "../../pages/Details"
import LoginForm from "../../pages/LoginForm"
import RegistrationForm from "../../pages/RegistrationForm"
import EditProfileForm from "../../pages/EditProfileForm"
import CreateArticle from "../../pages/CreateArticle"
import EditArticle from "../../pages/EditArticle"
import { useFetchCurrentUserQuery } from "../../service/authApiSlice"

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"))

  const { isError, error } = useFetchCurrentUserQuery(undefined, {
    skip: !token,
  })

  useEffect(() => {
    function onStorageChange() {
      setToken(localStorage.getItem("token"))
    }
    window.addEventListener("storage", onStorageChange)
    return () => window.removeEventListener("storage", onStorageChange)
  }, [])

  return (
    <>
      <Header token={token} setToken={setToken} />
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
          <Route path="/sign-in" element={<LoginForm setToken={setToken} />} />
          <Route path="/sign-up" element={<RegistrationForm />} />
          <Route path="/profile" element={<EditProfileForm />} />
        </Routes>
      </Main>
    </>
  )
}

export default App
