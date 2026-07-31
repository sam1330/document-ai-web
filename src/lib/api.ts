import axios from 'axios'
import { API_BASE_URL } from './utils'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  const pathname = window.location.pathname;
  const locale = pathname.split('/')[1] || 'en';

  if (locale) {
    config.headers['X-Locale'] = locale;
  }
  
  return config
})

let isRefreshing = false
let failedQueue: Array<{
  onSuccess: (token: string) => void
  onFailed: (error: any) => void
}> = []

const processQueue = (error: any, token?: string) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.onFailed(error)
    } else {
      prom.onSuccess(token!)
    }
  })

  isRefreshing = false
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const isRefreshCall = originalRequest?.url?.includes('/api/auth/refresh')

    // If the refresh call itself 401s, don't recurse into another refresh attempt:
    // that self-referential retry deadlocks (the outer refresh's await never settles,
    // since it depends on a queued promise only the outer call's own resolution
    // would flush), which left AuthContext's `loading` stuck `true` forever.
    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshCall) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            onSuccess: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(api(originalRequest))
            },
            onFailed: (err: any) => reject(err),
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await api.post('/api/auth/refresh', {})
        const { token } = response.data

        if (token) {
          localStorage.setItem('token', token)
          originalRequest.headers.Authorization = `Bearer ${token}`
          processQueue(null, token)
          return api(originalRequest)
        }
      } catch (refreshError) {
        processQueue(refreshError, undefined)
        localStorage.removeItem('token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
