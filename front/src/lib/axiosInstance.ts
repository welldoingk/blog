import axios, { AxiosInstance } from 'axios'
import { removeRefreshToken, removeToken, setToken } from '@/lib/auth'
import { useAuthApi } from '@/lib/api'

const API_BASE_URL = process.env.API_URL || 'http://localhost:8080/api'
console.log('API_URL:', process.env.API_URL)
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const authApi = useAuthApi()
        const newTokenData = await authApi.refreshToken()
        setToken(newTokenData.token)
        originalRequest.headers[
          'Authorization'
        ] = `Bearer ${newTokenData.token}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // 리프레시 토큰도 만료된 경우
        removeToken()
        removeRefreshToken()
        // 로그인 페이지로 리다이렉트
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  },
)

//
// // Request interceptor
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // You can add authentication token here
//     // const token = localStorage.getItem('token');
//     // if (token) {
//     //   config.headers['Authorization'] = `Bearer ${token}`;
//     // }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   },
// )
//
// // Response interceptor
// axiosInstance.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   (error: AxiosError) => {
//     if (error.response) {
//       // The request was made and the server responded with a status code
//       // that falls out of the range of 2xx
//       console.error('Error status:', error.response.status)
//       console.error('Error data:', error.response.data)
//     } else if (error.request) {
//       // The request was made but no response was received
//       console.error('Error request:', error.request)
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       console.error('Error message:', error.message)
//     }
//     return Promise.reject(error)
//   },
// )

export default axiosInstance
