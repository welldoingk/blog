import { useState, useCallback, useRef } from 'react'
import axiosInstance from './axiosInstance'

interface ApiState<T> {
  data: T | null
  error: string | null
  loading: boolean
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

const useApi = () => {
  const [state, setState] = useState<ApiState<unknown>>({
    data: null,
    error: null,
    loading: false,
  })

  const stateRef = useRef(state)
  stateRef.current = state

  const request = useCallback(
    async <R>(
      method: 'get' | 'post' | 'put' | 'delete',
      url: string,
      data?: any,
    ): Promise<R> => {
      if (!stateRef.current.loading) {
        setState((prev) => ({ ...prev, loading: true, error: null }))
      }
      try {
        const response = await axiosInstance<R>({ method, url, data })
        setState({
          data: response.data,
          error: null,
          loading: false,
        })
        return response.data
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'An error occurred'
        setState({ data: null, error: errorMessage, loading: false })
        throw error
      }
    },
    [],
  )

  const get = useCallback(
    async <R>(url: string, params?: any): Promise<R> => {
      return request<R>('get', url, { params })
    },
    [request],
  )

  const post = useCallback(
    async <R>(url: string, data: any): Promise<R> =>
      request<R>('post', url, data),
    [request],
  )

  const put = useCallback(
    async <R>(url: string, data: any): Promise<R> =>
      request<R>('put', url, data),
    [request],
  )

  const del = useCallback(
    async <R>(url: string): Promise<R> => request<R>('delete', url),
    [request],
  )

  return { ...state, get, post, put, del }
}

export default useApi
