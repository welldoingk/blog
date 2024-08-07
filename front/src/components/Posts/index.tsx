'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Post from '@/components/Post/post'
import { useBoardApi, Post as PostType } from '@/lib/api'

export default function Posts() {
  const [posts, setPosts] = useState<PostType[]>([])
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const { fetchPosts } = useBoardApi()

  const loadPosts = useCallback(async () => {
    try {
      const response = await fetchPosts({ page, size })
      setPosts(response.content)
      setTotalPages(response.totalPages)
    } catch (err) {
      console.error('Error fetching posts:', err)
    }
  }, [fetchPosts, page, size])

  useEffect(() => {
    loadPosts()
  }, [page, size])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  return (
    <>
      <section className="pt-20">
        <header className="bg-slate-800 space-y-4 p-4 rounded-t-2xl sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-white p-5">POST</h1>
            <Link
              href="/posts/write/new"
              className="hover:bg-blue-400 group flex items-center rounded-md bg-blue-500 text-white text-sm font-medium pl-2 pr-3 py-2 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-plus-square-fill"
                viewBox="0 0 16 16"
              >
                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0" />
              </svg>
              <span className="pl-1">add</span>
            </Link>
          </div>
        </header>
      </section>
      <div className="bg-slate-700 p-4 rounded-b-2xl">
        <blockquote className="m-8">
          <div className="flex-auto items-center justify-center min-h-full">
            {posts.length > 0 ? (
              <div className="flex flex-col space-y-4">
                {posts.map((post) => (
                  <Post key={post.id} {...post} />
                ))}
              </div>
            ) : (
              <div>조회된 데이터가 없습니다.</div>
            )}
          </div>
        </blockquote>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded-l"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-r"
          >
            Next
          </button>
        </div>
      </div>
    </>
  )
}
