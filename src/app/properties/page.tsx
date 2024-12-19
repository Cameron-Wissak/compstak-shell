'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Building2, MapPin, DollarSign, Plus } from 'lucide-react'
import PropertyMap from '@/components/features/PropertyMap'

// Sample properties data - in a real app, this would come from an API
const properties = [
  {
    id: '1',
    name: 'Downtown Office Complex',
    address: '123 Main St, City, State',
    type: 'Office',
    size: '50,000 sqft',
    price: '$12.5M',
    image: 'https://picsum.photos/400/300',
  },
  {
    id: '2',
    name: 'Retail Plaza',
    address: '456 Oak Ave, City, State',
    type: 'Retail',
    size: '25,000 sqft',
    price: '$8.2M',
    image: 'https://picsum.photos/400/301',
  },
  {
    id: '3',
    name: 'Industrial Park',
    address: '789 Pine St, City, State',
    type: 'Industrial',
    size: '100,000 sqft',
    price: '$15.8M',
    image: 'https://picsum.photos/400/302',
  },
]

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Properties</h1>
        <div className="space-x-4">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-md ${
              viewMode === 'grid'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Grid View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-md ${
              viewMode === 'map'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            Map View
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src={property.image}
                  alt={property.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {property.name}
                </h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-2" />
                    {property.address}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Building2 className="w-4 h-4 mr-2" />
                    {property.type} • {property.size}
                  </div>
                  <div className="flex items-center text-sm font-medium text-gray-900">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {property.price}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow">
          <PropertyMap />
        </div>
      )}
    </div>
  )
} 