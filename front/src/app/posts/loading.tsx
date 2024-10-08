import PostLoading from '@/components/post/PostLoading'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function Loading() {
  return (
    <>
      <section className="pt-20">
        <header className="bg-slate-800 space-y-4 p-4 rounded-t-2xl sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-white p-5">
              <Skeleton width={'100px'} />
            </h1>
          </div>
        </header>
      </section>
      <div className="bg-slate-700 p-4 rounded-b-2xl">
        <blockquote className="m-8">
          <div className="flex-auto items-center justify-center min-h-full">
            <div className="flex flex-col space-y-4">
              <PostLoading />
              <PostLoading />
              <PostLoading />
              <PostLoading />
              <PostLoading />
              <PostLoading />
              <PostLoading />
              <PostLoading />
              <PostLoading />
              <PostLoading />
            </div>
          </div>
        </blockquote>
      </div>
    </>
  )
}
