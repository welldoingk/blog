import axiosInstance from '@/lib/axiosInstance'
import { PageResponse } from '@/lib/useApi'
import { Post } from '@/lib/api'

export const fetchPosts = async ({
  page,
  size,
}: {
  page: number
  size: number
}) => {
  const response = await axiosInstance.get<PageResponse<Post>>('/posts', {
    params: { page, size },
  })
  return response.data
}
