import axios from 'axios'
import { Post } from '@/lib/api'
import { PageResponse } from '@/lib/useApi'

const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'http://backend:8080/api'
    : process.env.API_URL

export async function fetchInitialPosts(): Promise<PageResponse<Post>> {
  const response = await axios.get(`${API_URL}/posts`, {
    params: { page: 0, size: 10 },
  })
  return response.data
}
