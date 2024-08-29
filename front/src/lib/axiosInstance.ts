import axios, { AxiosInstance } from 'axios'
import { useAppDispatch } from '@/hooks/reduxHooks'
import { removeToken, getToken, getRefreshToken, setToken } from '@/lib/auth'
import { logout } from '@/store/authSlice'
import qs from 'qs'

const API_BASE_URL = process.env.API_URL || 'http://localhost:8080/api'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
})

axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Axios request config:', config)
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const dispatch = useAppDispatch()
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = getRefreshToken()
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {
            refreshToken,
          },
        )

        const { accessToken } = response.data
        setToken(accessToken)

        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // 리프레시 토큰도 만료되었거나 갱신에 실패한 경우
        dispatch(logout())
        removeToken()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
