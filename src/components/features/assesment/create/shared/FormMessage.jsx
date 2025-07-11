import React from 'react'
import MarkIcon from '@/assets/mark.svg?react';
function FormMessage({ className = "", message }) {
  if (!message) return null;
  return (
    <div className={`${className} w-full bg-red-50  p-2 rounded-xl border border-red-400`}>
      <MarkIcon className="w-4 h-4 inline mr-1 text-red-500" />
      <span className="text-red-500 text-xs font-medium"> {message}</span>
    </div>
  )
}

export default FormMessage