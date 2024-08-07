'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useBoardApi, Post } from '@/lib/api'
import ErrorModal from '@/components/errorModal'

export default function Detail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { fetchPosts, deletePost } = useBoardApi()
  const [post, setPost] = useState<Post | null>(null)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const loadPost = async () => {
      try {
        const response = await fetchPosts({ params })
        setPost(response.content[0])
      } catch (err) {
        console.error('Error fetching post:', err)
        setError('게시글을 불러오는 데 실패했습니다.')
      }
    }

    loadPost()
  }, [params])

  const handleDelete = async () => {
    try {
      await deletePost(parseInt(params.id))
      router.push('/posts')
    } catch (err) {
      console.error('Error deleting post:', err)
      setError('게시글 삭제에 실패했습니다.')
    }
  }

  if (!post) return <div>Loading...</div>

  return (
    <section className="pt-20 pb-20">
      <ErrorModal error={error} onClose={() => setError('')} />
      <header className="bg-slate-800 space-y-4 p-4 rounded-t-2xl sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6">
        <div className="flex items-center justify-between">
          <div>
            <figcaption className="font-medium">
              <div className="text-3xl text-sky-500 dark:text-sky-400">
                {post.title}
              </div>
              <div className="text-slate-700 dark:text-slate-500">
                {post.createdAt}
              </div>
            </figcaption>
          </div>
          <div className="flex">
            <Link
              href={`/posts/write/${post.id}`}
              className="mr-2 hover:bg-blue-400 group flex items-center rounded-md bg-blue-500 text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-pencil-square"
                viewBox="0 0 16 16"
              >
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                <path
                  fillRule="evenodd"
                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                />
              </svg>
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="mr-2 hover:bg-red-400 group flex items-center rounded-md bg-red-500 text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-trash"
                viewBox="0 0 16 16"
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
              </svg>
              Delete
            </button>
            <Link
              href="/posts"
              className="hover:bg-blue-400 group flex items-center rounded-md bg-blue-500 text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-list-task"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5zM3 3H2v1h1z"
                />
                <path d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1z" />
                <path
                  fillRule="evenodd"
                  d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5zM2 7h1v1H2zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm1 .5H2v1h1z"
                />
              </svg>
              <span className="pl-1">List</span>
            </Link>
          </div>
        </div>
      </header>
      <div className="bg-slate-700 p-4 rounded-b-2xl">
        <blockquote className="m-8">
          <p className="text-lg font-medium text-white">{post.content}</p>
        </blockquote>
      </div>
    </section>
  )
}
