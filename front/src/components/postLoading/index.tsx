import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const PostLoading = () => {
  // toggle sidebar

  return (
    <div className="flex flex-col p-4 bg-gray-800 border border-gray-800 shadow-md hover:text-green-500 text-gray-400 hover:shodow-lg rounded-2xl transition ease-in duration-500  transform hover:scale-105 cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center mr-auto">
          <div className="-space-x-5 flex ">
            <Skeleton className="flex rounded-full" width={'25px'} />
          </div>

          <div className="flex flex-col ml-3 min-w-0">
            <div className="font-medium leading-none text-gray-100">
              <Skeleton width={'200px'} />
            </div>
            <p className="text-sm text-gray-500 leading-none mt-1 truncate">
              <Skeleton width={'100px'} />
            </p>
          </div>
        </div>
        <div className="flex flex-col ml-3 min-w-0">
          <Skeleton width={'10px'} />
        </div>
      </div>
    </div>
  )
}

export default PostLoading
