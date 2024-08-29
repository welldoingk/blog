import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function PostsSkeleton() {
  return (
    <div className="bg-slate-900 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-slate-800 rounded-xl shadow-xl overflow-hidden">
        <header className="bg-slate-700 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-white p-5">
              <Skeleton width={'100px'} />
            </h1>
          </div>
        </header>
        <div className="p-6">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="mb-4">
              <Skeleton height={60} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
