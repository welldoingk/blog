import { useCallback } from 'react'
import useApi, { PageResponse } from './useApi'

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
    (params: any) => api.get<PageResponse<Post>>('/posts', { params }),
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
    ...api,
  }
}

export default {
  useEventApi,
  useBoardApi,
}
