import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (credential, { rejectWithValue }) => {
    try {
      const res = await api.post('/users/login', { credential })
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed')
    }
  }
)

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/users/me')
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Session expired')
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/users/logout')
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Logout failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // loginWithGoogle
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user || action.payload
        state.isAuthenticated = true
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // loadUser
      .addCase(loadUser.pending, (state) => {
        state.loading = true
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user || action.payload
        state.isAuthenticated = true
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false
        state.user = null
        state.isAuthenticated = false
      })
      // logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.loading = false
      })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
