import React from 'react'

export default function Loading() {
  return (
    <>


      {<div id="modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-60">
        <div className=" p-8">
          <div role="status" className='flex items-center justify-center h-full text-white'>
            <div className="relative">
              <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-gray-200"></div>
              <div
                className="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-secondary border-t-transparent">
              </div>
            </div>
          </div>
        </div>
      </div>}

    </>
  )
}
