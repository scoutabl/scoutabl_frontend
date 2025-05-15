import React from 'react'

const Output = ({ output }) => {
  return (
    <div className='mt-4'>
      <h2 className='text-lg font-semibold mb-2'>Output</h2>
      <pre className='bg-gray-100 p-4 rounded-md'>
      </pre>
      {output}
    </div>
  )
}

export default Output