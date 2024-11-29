import { Suspense } from 'react'
import PostList from '@/components/post/PostList3'
import Loading from './loading'
import { fetchInitialPosts } from '@/lib/serverApi'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Posts',
}

export default async function PostsPage() {
  const initialPosts = await fetchInitialPosts()

  return (
    <Suspense fallback={<Loading />}>
      <PostList initialPosts={initialPosts} />
    </Suspense>
  )
}
