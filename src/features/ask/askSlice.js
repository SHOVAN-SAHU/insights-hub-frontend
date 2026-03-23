import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const askQuestion = createAsyncThunk(
  'ask/askQuestion',
  async ({ spaceId, question }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/ask/${spaceId}`, { question })
      return { question, answer: res.data }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to get answer')
    }
  }
)

const askSlice = createSlice({
  name: 'ask',
  initialState: {
    answers: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAnswers: (state) => { state.answers = [] },
    clearAskError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(askQuestion.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(askQuestion.fulfilled, (state, action) => {
        state.loading = false
        state.answers.push({
          id: Date.now(),
          question: action.payload.question,
          answer: action.payload.answer,
          timestamp: new Date().toISOString(),
        })
      })
      .addCase(askQuestion.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearAnswers, clearAskError } = askSlice.actions
export default askSlice.reducer
