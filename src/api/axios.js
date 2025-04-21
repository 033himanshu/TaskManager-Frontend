import axios from "axios"
import Auth from '@/api/auth'
const instance = axios.create({
  baseURL: import.meta.env.BACKEND_SERVER_BASE_URL || "http://localhost:3000/api/v1/",
  withCredentials: true,
  headers: {
    // "Content-Type": "application/json",
    Accept: "application/json",
  },
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => instance(originalRequest))
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await Auth.refreshAccessToken()
        processQueue(null)
        return instance(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

const apiCall = async (route, payload = {}, method = "GET") => {
  try {
    let response

    switch (method) {
      case "GET":
        response = await instance.get(route, { params: payload })
        break
      case "POST":
        response = await instance.post(route, payload)
        break
      case "PATCH":
        response = await instance.patch(route, payload)
        break
      case "DELETE":
        response = await instance.delete(route, { data: payload })
        break
      default:
        return { error: "Unsupported request method" }
    }

    const { success, data, message } = response.data

    if (success) {
      return data
    } else {
      return { error: message || "Unknown API error" }
    }
  } catch (error) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.data?.message ||
      error?.message ||
      "Unknown request error"

    return { error: errorMessage }
  }
}

export default apiCall
