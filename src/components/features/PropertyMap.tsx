'use client'

import Image from 'next/image'

export default function PropertyMap() {
  return (
    <div className="border border-gray-200 bg-white rounded shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Property Locations</h3>
      </div>
      <div className="p-4">
        <Image
          src="https://picsum.photos/800/400"
          alt="Map"
          width={800}
          height={400}
          className="w-full h-auto rounded"
        />
      </div>
    </div>
  )
} 