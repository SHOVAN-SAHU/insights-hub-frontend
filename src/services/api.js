import axios from 'axios'
import { store } from '../app/store'
import { logout } from '../features/auth/authSlice'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_SERVICE_URL}/api/v1`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout())
    }
    return Promise.reject(error)
  }
)

export default api
