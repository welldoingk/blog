import Link from 'next/link'
import { fetchPosts } from '@/lib/apiV2' // 서버에서 사용할 수 있는 fetchPosts 함수가 필요합니다
import { PlusIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { format } from 'date-fns'

export default async function PostList({ page = 0, size = 10 }) {
  const response = await fetchPosts({ page, size })
  const { content: posts, totalPages } = response

  return (
    <div className="bg-slate-900 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-slate-800 rounded-xl shadow-xl overflow-hidden">
        <header className="bg-slate-700 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">POST</h1>
            <Link
              href="/posts/write/new"
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              <span>Add</span>
            </Link>
          </div>
        </header>
        <div className="p-6">
          {posts.length > 0 ? (
            <div className="space-y-3">
              {posts.map((post) => (
                <Link href={`/posts/detail/${post.id}`} key={post.id}>
                  <div className="bg-slate-700 p-4 rounded-lg hover:bg-slate-600 transition duration-300 mb-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-xl font-semibold text-white">
                          {post.title}
                        </h2>
                        <p className="text-sm text-gray-300 mt-1">
                          {format(new Date(post.createdAt), 'yyyy-MM-dd HH:mm')}
                        </p>
                      </div>
                      <ChevronRightIcon className="h-6 w-6 text-gray-300" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-300 py-10">
              조회된 데이터가 없습니다.
            </div>
          )}
        </div>
        <div className="bg-slate-700 px-6 py-4 flex justify-center space-x-4">
          <Link
            href={`/posts?page=${page - 1}`}
            className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 ${
              page === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Previous
          </Link>
          <Link
            href={`/posts?page=${page + 1}`}
            className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 ${
              page >= totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  )
}
