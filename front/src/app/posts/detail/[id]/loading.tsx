import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function Loading() {
  return (
    <>
      <section className="pt-20 pb-20">
        <header className="bg-slate-800 space-y-4 p-4 rounded-t-2xl sm:px-8 sm:py-6 lg:p-4 xl:px-8 xl:py-6">
          <div className="flex items-center justify-between">
            <div>
              <figcaption className="font-medium">
                <div className="text-3xl text-sky-500 dark:text-sky-400">
                  <Skeleton className="circle" width={'100px'} />
                </div>
                <div className="text-slate-700 dark:text-slate-500">
                  <Skeleton width={'100px'} />
                </div>
              </figcaption>
            </div>
            <Skeleton width={'100px'} />
          </div>
        </header>
        <div className="bg-slate-700  p-4 rounded-b-2xl">
          <blockquote className="m-8">
            <p className="text-lg font-medium text-white">
              <Skeleton width={'100px'} count={5} />
            </p>
          </blockquote>
        </div>
      </section>
    </>
  )
}
