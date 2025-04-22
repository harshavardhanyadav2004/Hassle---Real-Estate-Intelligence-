"use client"

import { useState, useEffect } from "react"

export default function LoadingIndicator({ isLoading = true }) {
  const [dots, setDots] = useState("")

  useEffect(() => {
    if (!isLoading) return

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return ""
        return prev + "."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [isLoading])

  if (!isLoading) return null

  return (
    <div className="flex items-center bg-gray-800 rounded-md p-3 px-4 max-w-xs my-2">
      <div className="h-5 w-5 mr-3">
        <svg
          className="animate-spin h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
      <div className="text-white text-lg">AI is thinking{dots}</div>
    </div>
  )
}
