'use client'

import { Download, FilePlus } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="h-16 flex items-center justify-end border-b border-gray-200 px-6 bg-white">
      <div className="space-x-4 flex items-center">
        <button className="inline-flex items-center space-x-2 border border-gray-300 rounded px-3 py-1 text-gray-700 hover:bg-gray-50 transition">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
        <Link
          href="/deals"
          className="inline-flex items-center space-x-2 bg-blue-600 text-white rounded px-3 py-1 hover:bg-blue-700 transition"
        >
          <FilePlus className="w-4 h-4" />
          <span>New Deal</span>
        </Link>
      </div>
    </header>
  )
} 