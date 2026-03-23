import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchSpaces = createAsyncThunk(
  'spaces/fetchSpaces',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/spaces')
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch spaces')
    }
  }
)

export const createSpace = createAsyncThunk(
  'spaces/createSpace',
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post('/spaces', data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create space')
    }
  }
)

export const updateSpace = createAsyncThunk(
  'spaces/updateSpace',
  async ({ spaceId, data }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/spaces/${spaceId}`, data)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update space')
    }
  }
)

export const addMember = createAsyncThunk(
  'spaces/addMember',
  async ({ spaceId, members }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/spaces/${spaceId}/members`, { members })
      // return spaceId alongside so reducer knows which space to refetch
      return { spaceId, ...res.data }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add members')
    }
  }
)

export const removeMember = createAsyncThunk(
  'spaces/removeMember',
  async ({ spaceId, members }, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/spaces/${spaceId}/members`, { data: { members } })
      return { spaceId, members }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove members')
    }
  }
)

// After add/remove we re-fetch the single space to get fresh populated participants
export const fetchSingleSpace = createAsyncThunk(
  'spaces/fetchSingleSpace',
  async (spaceId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/spaces/${spaceId}`)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch space')
    }
  }
)

const spaceSlice = createSlice({
  name: 'spaces',
  initialState: {
    spaces: [],
    currentSpace: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentSpace: (state, action) => {
      state.currentSpace = action.payload
    },
    clearSpaceError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // ── fetchSpaces ──────────────────────────────────────
      .addCase(fetchSpaces.pending, (state) => { state.loading = true })
      .addCase(fetchSpaces.fulfilled, (state, action) => {
        state.loading = false
        const data = action.payload
        if (Array.isArray(data)) {
          state.spaces = data
        } else if (Array.isArray(data?.spaces)) {
          state.spaces = data.spaces
        } else if (Array.isArray(data?.data)) {
          state.spaces = data.data
        } else {
          state.spaces = []
        }
      })
      .addCase(fetchSpaces.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ── createSpace ──────────────────────────────────────
      .addCase(createSpace.pending, (state) => { state.loading = true })
      .addCase(createSpace.fulfilled, (state, action) => {
        state.loading = false
        const data = action.payload
        const newSpace = data?.space || data?.data || data
        if (newSpace?._id) state.spaces.push(newSpace)
      })
      .addCase(createSpace.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // ── updateSpace ──────────────────────────────────────
      .addCase(updateSpace.fulfilled, (state, action) => {
        const updated = action.payload.space || action.payload
        const idx = state.spaces.findIndex((s) => s._id === updated._id)
        if (idx !== -1) state.spaces[idx] = updated
        if (state.currentSpace?._id === updated._id) state.currentSpace = updated
      })

      // ── fetchSingleSpace (used after member changes) ─────
      .addCase(fetchSingleSpace.fulfilled, (state, action) => {
        const updated = action.payload?.space || action.payload
        if (!updated?._id) return
        const idx = state.spaces.findIndex((s) => s._id === updated._id)
        if (idx !== -1) state.spaces[idx] = updated
        else state.spaces.push(updated)
        if (state.currentSpace?._id === updated._id) state.currentSpace = updated
      })
  },
})

export const { setCurrentSpace, clearSpaceError } = spaceSlice.actions
export default spaceSlice.reducer