'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useBoardApi, Post } from '@/lib/api'

const RecentPosts = () => {
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { fetchPosts } = useBoardApi()

  useEffect(() => {
    const loadRecentPosts = async () => {
      try {
        setIsLoading(true)
        const response = await fetchPosts({
          page: 0,
          size: 6,
          sort: 'createdAt,desc',
        })
        setRecentPosts(response.content)
        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching recent posts:', err)
        setError('Failed to load recent posts')
        setIsLoading(false)
      }
    }

    loadRecentPosts()
  }, [])

  if (isLoading) {
    return <div className="text-center">Loading recent posts...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center text-gray-200">
        Recent Posts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {recentPosts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
          >
            <h3 className="text-xl font-semibold mb-3 text-gray-100">
              {post.title}
            </h3>
            <p className="text-gray-400 mb-4 text-sm">
              {post.content.substring(0, 100)}...
            </p>
            <Link
              href={`/posts/detail/${post.id}`}
              className="text-blue-400 hover:text-blue-300 inline-flex items-center text-sm"
            >
              Read more
              <svg
                className="w-4 h-4 ml-2"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RecentPosts
