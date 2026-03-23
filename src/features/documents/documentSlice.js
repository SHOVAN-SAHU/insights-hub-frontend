import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async (spaceId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/documents/${spaceId}`)
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch documents')
    }
  }
)

export const uploadDocument = createAsyncThunk(
  'documents/uploadDocument',
  async ({ spaceId, formData }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/documents/upload/${spaceId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to upload document')
    }
  }
)

export const deleteDocument = createAsyncThunk(
  'documents/deleteDocument',
  async (documentId, { rejectWithValue }) => {
    try {
      await api.delete(`/documents/${documentId}`)
      return documentId
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete document')
    }
  }
)

const documentSlice = createSlice({
  name: 'documents',
  initialState: {
    documents: [],
    loading: false,
    uploading: false,
    error: null,
  },
  reducers: {
    clearDocumentError: (state) => { state.error = null },
    clearDocuments: (state) => { state.documents = [] },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => { state.loading = true })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false
        state.documents = action.payload.documents || action.payload
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(uploadDocument.pending, (state) => { state.uploading = true })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.uploading = false
        const doc = action.payload.document || action.payload
        if (doc) state.documents.push(doc)
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.uploading = false
        state.error = action.payload
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.documents = state.documents.filter((d) => d._id !== action.payload)
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { clearDocumentError, clearDocuments } = documentSlice.actions
export default documentSlice.reducer
