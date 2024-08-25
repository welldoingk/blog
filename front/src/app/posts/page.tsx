import { Suspense } from 'react'
import PostList from '@/components/post/PostList2'
import Loading from './loading'

export const metadata = {
  title: 'Posts',
}

export default function PostsPage() {
  return <PostList />
}
