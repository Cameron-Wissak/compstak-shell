'use client'

import { useState } from 'react'
import { Search, Filter, Plus } from 'lucide-react'
import DealPipeline from '@/components/features/DealPipeline'
import DealDetails from '@/components/features/DealDetails'
import DealForm from '@/components/features/DealForm'

export default function DealsPage() {
  const [showDealForm, setShowDealForm] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)

  const handleDealSubmit = (deal: any) => {
    // In a real app, this would save to an API
    console.log('New deal:', deal)
    setShowDealForm(false)
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Deals Pipeline</h1>
        <button
          onClick={() => setShowDealForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Deal
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search deals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </button>
      </div>

      {/* Filter Panel - Show when filterOpen is true */}
      {filterOpen && (
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deal Stage
              </label>
              <select className="w-full border border-gray-300 rounded-md p-2">
                <option value="">All Stages</option>
                <option value="initial">Initial Inquiry</option>
                <option value="qualification">Qualification</option>
                <option value="underwriting">Underwriting</option>
                {/* Add more stages */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select className="w-full border border-gray-300 rounded-md p-2">
                <option value="">All Types</option>
                <option value="office">Office</option>
                <option value="retail">Retail</option>
                <option value="industrial">Industrial</option>
                {/* Add more types */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deal Size
              </label>
              <select className="w-full border border-gray-300 rounded-md p-2">
                <option value="">All Sizes</option>
                <option value="small">Under $1M</option>
                <option value="medium">$1M - $5M</option>
                <option value="large">Over $5M</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned To
              </label>
              <select className="w-full border border-gray-300 rounded-md p-2">
                <option value="">All Team Members</option>
                <option value="john">John Smith</option>
                <option value="sarah">Sarah Johnson</option>
                {/* Add more team members */}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Pipeline View */}
      <div className="bg-gray-50 rounded-lg p-6">
        <DealPipeline />
      </div>

      {/* Modals */}
      {showDealForm && (
        <DealForm
          onClose={() => setShowDealForm(false)}
          onSubmit={handleDealSubmit}
        />
      )}

      {selectedDeal && (
        <DealDetails
          deal={selectedDeal}
          onClose={() => setSelectedDeal(null)}
          onUpdate={(updatedDeal) => {
            // In a real app, this would save to an API
            console.log('Updated deal:', updatedDeal)
            setSelectedDeal(null)
          }}
        />
      )}
    </div>
  )
} 