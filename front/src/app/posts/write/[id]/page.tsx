'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBoardApi, Post, PostRequestDto } from '@/lib/api'
import ErrorModal from '@/components/modal/ErrorModal'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function PostWriteEdit({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { fetchPosts, createPost, updatePost } = useBoardApi()
  const [post, setPost] = useState<Post>({
    id: 0,
    boardId: 1,
    title: '',
    content: '',
    viewCount: 0,
    delYn: 'N',
    createdAt: '',
    modifiedAt: '',
  })
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const loadPost = async () => {
      if (params.id && params.id !== 'new') {
        try {
          const response = await fetchPosts({ params })
          setPost(response.content[0])
        } catch (err) {
          console.error('Error fetching post:', err)
          setError('게시글을 불러오는 데 실패했습니다.')
        }
      }
    }

    loadPost()
  }, [params.id])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!post.title || !post.content) {
      setError('제목과 내용을 모두 입력해주세요.')
      return
    }

    const postRequestDto: PostRequestDto = {
      boardId: post.boardId,
      title: post.title,
      content: post.content,
    }

    try {
      if (params.id === 'new') {
        await createPost(postRequestDto)
      } else {
        await updatePost(post.id, postRequestDto)
      }
      router.push('/posts')
    } catch (err) {
      console.error('Error saving post:', err)
      setError('게시글 저장에 실패했습니다.')
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target
    setPost((prevPost) => ({ ...prevPost, [id]: value }))
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto p-4">
        <ErrorModal error={error} onClose={() => setError('')} />
        <form onSubmit={handleSubmit} className="space-y-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-300"
          >
            제목
          </label>
          <div className="group relative rounded-md dark:bg-slate-700 dark:highlight-white/10 dark:focus-within:bg-transparent">
            <input
              type="text"
              id="title"
              value={post.title}
              onChange={handleChange}
              className="appearance-none w-full text-sm leading-8 bg-transparent text-slate-900 placeholder:text-slate-400 rounded-md py-2 pl-5 pr-5 ring-1 ring-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-100 dark:placeholder:text-slate-500 dark:ring-0 dark:focus:ring-2"
            />
          </div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-300"
          >
            내용
          </label>
          <div className="relative rounded-md dark:bg-slate-700 dark:highlight-white/10 dark:focus-within:bg-transparent">
            <textarea
              id="content"
              rows={10}
              value={post.content}
              onChange={handleChange}
              className="appearance-none w-full text-sm bg-transparent text-slate-900 placeholder:text-slate-400 rounded-md py-2 pl-5 pr-5 ring-1 ring-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-100 dark:placeholder:text-slate-500 dark:ring-0 dark:focus:ring-2"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {params.id === 'new' ? '저장' : '수정'}
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  )
}
