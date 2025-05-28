/* eslint-disable no-param-reassign */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { BASE_URL } from "../service/config"
import axios from "axios"

export const selectAuthData = (state) => state.auth.data
export const selectAuthStatus = (state) => state.auth.status
export const selectAuthError = (state) => state.auth.error
export const selectIsAuth = (state) => Boolean(state.auth.data)

export const fetchAuth = createAsyncThunk(
  "auth/fetchAuth",
  async (userData) => {
    const response = await axios.post(`${BASE_URL}users/login`, userData)
    localStorage.setItem("token", response.data.user.token)
    localStorage.setItem("data", JSON.stringify(response.data))
    return response.data
  }
)
export const fetchRegister = createAsyncThunk(
  "auth/fetchRegister",
  async (userData) => {
    try {
      const response = await axios.post(`${BASE_URL}users`, userData)
      localStorage.setItem("token", response.data.user.token)
      localStorage.setItem("data", JSON.stringify(response.data))
      return response.data
    } catch (e) {
      throw new Error("request error")
    }
  }
)

export const fetchEditData = createAsyncThunk(
  "auth/fetchEditData",
  async (userData) => {
    const token = localStorage.getItem("token")
    const response = await fetch(`${BASE_URL}user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(userData),
    })
    const data = await response.json()
    localStorage.setItem("data", JSON.stringify(data))
    localStorage.setItem("image", JSON.stringify(data.user.image))
    return data
  }
)

export const initAuth = createAsyncThunk("auth/initAuth", async () => {
  const token = localStorage.getItem("token")
  if (token) {
    const response = await axios.get(`${BASE_URL}user`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    localStorage.setItem("data", JSON.stringify(response.data))
    return response.data
  }
  return null
})

const initialState = {
  data: null,
  status: "loading",
  error: null,
}
const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.data = null
    },
    login: (state, action) => {
      state.data = action.payload
      localStorage.setItem("data", JSON.stringify(action.payload))
      localStorage.setItem("token", action.payload.user.token)
    },
    edit: (state, action) => {
      state.data = action.payload
      localStorage.setItem("data", JSON.stringify(action.payload))
      localStorage.setItem("image", JSON.stringify(action.payload.user.image))
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAuth.pending, (state) => {
        state.status = "loading"
        state.data = null
      })
      .addCase(fetchAuth.fulfilled, (state, action) => {
        state.status = "resolved"
        state.data = action.payload
      })
      .addCase(fetchAuth.rejected, (state) => {
        state.status = "rejected"
        state.data = null
      })

      .addCase(fetchRegister.pending, (state) => {
        state.status = "loading"
        state.data = null
      })
      .addCase(fetchRegister.fulfilled, (state, action) => {
        state.status = "resolved"
        state.data = action.payload
      })
      .addCase(fetchRegister.rejected, (state, action) => {
        state.status = "rejected"
        state.data = null
        state.error = action.payload
      })

      .addCase(fetchEditData.pending, (state) => {
        state.status = "loading"
        state.data = null
      })
      .addCase(fetchEditData.fulfilled, (state, action) => {
        state.status = "resolved"
        state.data = action.payload
      })
      .addCase(fetchEditData.rejected, (state) => {
        state.status = "rejected"
        state.data = null
      })

      .addCase(initAuth.fulfilled, (state, action) => {
        state.status = "resolved"
        state.data = action.payload
      })
      .addCase(initAuth.rejected, (state) => {
        state.status = "rejected"
        state.data = null
      })
  },
})

export const { logout, login, edit } = authSlice.actions
export default authSlice.reducer
