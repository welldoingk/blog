import { useCallback } from 'react'
import { getRefreshToken, setToken, setTokens } from './auth'
import useApi, { PageResponse } from './useApi'
import qs from 'qs'

export interface AuthResponse {
  token: string
  refreshToken: string
  username: string
  expirationDate?: Date // JWT 토큰의 만료 날짜 (선택적)
}

export const useAuthApi = () => {
  const api = useApi()

  const login = useCallback(
    async (loginData: { username: string; password: string }) => {
      const response = await api.post<AuthResponse>('/auth/login', loginData)
      setTokens(response.token, response.refreshToken)
      return response
    },
    [api],
  )

  const refreshToken = useCallback(async () => {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    const response = await api.post<AuthResponse>('/auth/refresh-token', {
      refreshToken,
    })
    setToken(response.token)
    return response
  }, [api])

  const signup = useCallback(
    (signupData: { username: string; password: string }) =>
      api.post<AuthResponse>('/auth/signup', signupData),
    [api],
  )
  return {
    login,
    refreshToken,
    signup,
  }
}

// Event 인터페이스 (기존과 동일)
export interface Event {
  id: string
  title: string
  start: string
  end: string
  color: string
}

// 이벤트 관련 API 훅
export const useEventApi = () => {
  const api = useApi()

  const fetchEvents = () => api.get('/events')
  const createEvent = (event: Omit<Event, 'id'>) => api.post('/events', event)
  const updateEvent = (event: Event) => api.put(`/events/${event.id}`, event)
  const deleteEvent = (id: string) => api.del(`/events/${id}`)

  return {
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    loading: api.loading,
    error: api.error,
  }
}

// Post 인터페이스 추가 (필요에 따라 속성을 조정하세요)
export interface Post {
  id: number
  boardId: number
  title: string
  content: string
  viewCount: number
  delYn: string
  createdAt: string
  modifiedAt: string
}

export interface PostRequestDto {
  boardId: number
  title: string
  content: string
}

export const useBoardApi = () => {
  const api = useApi()

  const fetchPosts = useCallback(
    (params: any) => {
      const queryString = qs.stringify(params)
      console.log('Query string:', queryString)
      return api.get<PageResponse<Post>>(`/posts?${queryString}`)
    },
    [api],
  )

  const searchPosts = useCallback(
    (keyword: string, params: any = {}) => {
      const queryString = qs.stringify({ keyword, ...params })
      console.log('Search Query string:', queryString)
      return api.get<PageResponse<Post>>(`/posts/search?${queryString}`)
    },
    [api],
  )
  const createPost = useCallback(
    (post: PostRequestDto) => api.post<Post>('/posts', post),
    [api],
  )
  const updatePost = useCallback(
    (id: number, post: PostRequestDto) => api.put<Post>(`/posts/${id}`, post),
    [api],
  )
  const deletePost = useCallback(
    (id: number) => api.del<void>(`/posts/${id}`),
    [api],
  )

  return {
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    searchPosts,
    ...api,
  }
}

export default {
  useEventApi,
  useBoardApi,
}
