import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios'
import { getToken } from './auth'

const API_BASE_URL = process.env.API_URL || 'http://localhost:8080/api'
console.log('API_URL:', process.env.API_URL)
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

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
