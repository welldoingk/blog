import React from 'react'

const FullPageLoading: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <div className="text-white text-2xl font-semibold animate-pulse">
          Loading...
        </div>
        {/*<div className="text-gray-400 mt-2">*/}
        {/*  Please wait while we prepare your experience*/}
        {/*</div>*/}
      </div>
    </div>
  )
}

export default FullPageLoading
