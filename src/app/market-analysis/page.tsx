'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarketMapView } from '@/components/market-map-view'
import MarketMap from '@/components/features/MarketMap'
import LeaseDetails from '@/components/features/LeaseDetails'
import { parseCompStakData, ParsedComparable } from '@/utils/parseComparables'
import { leaseCompsData } from '@/data/leaseComps'
import { MapPin, Building2, Calendar, DollarSign } from 'lucide-react'

export default function MarketAnalysisPage() {
  const [selectedType, setSelectedType] = useState<string>()
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>()
  const [minSqft, setMinSqft] = useState<number>()
  const [maxSqft, setMaxSqft] = useState<number>()
  const [minRent, setMinRent] = useState<number>()
  const [maxRent, setMaxRent] = useState<number>()
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')
  const [selectedLease, setSelectedLease] = useState<any>(null)
  const [starredLeases, setStarredLeases] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Load starred leases from localStorage
    const saved = localStorage.getItem('starredLeases')
    if (saved) {
      setStarredLeases(new Set(JSON.parse(saved)))
    }
  }, [])

  const comparables = parseCompStakData(leaseCompsData)

  // Filter comparables based on criteria
  const filteredComparables = comparables.filter(comp => {
    if (selectedType && comp.spaceType !== selectedType) return false
    if (dateRange?.start && new Date(comp.executionDate) < dateRange.start) return false
    if (dateRange?.end && new Date(comp.executionDate) > dateRange.end) return false
    if (minSqft && comp.transactionSqft < minSqft) return false
    if (maxSqft && comp.transactionSqft > maxSqft) return false
    if (minRent && comp.startingRent < minRent) return false
    if (maxRent && comp.startingRent > maxRent) return false
    return true
  })

  const getLeaseId = (lease: ParsedComparable) => {
    return `${lease.address}-${lease.tenantName}-${lease.executionDate}`
  }

  const handleStarLease = (lease: ParsedComparable) => {
    const leaseId = getLeaseId(lease)
    const newStarred = new Set(starredLeases)
    
    if (newStarred.has(leaseId)) {
      newStarred.delete(leaseId)
    } else {
      newStarred.add(leaseId)
    }
    
    setStarredLeases(newStarred)
    localStorage.setItem('starredLeases', JSON.stringify(Array.from(newStarred)))
  }

  // Group leases by address for summary
  const leasesByAddress = filteredComparables.reduce((acc, comp) => {
    if (!acc[comp.address]) {
      acc[comp.address] = []
    }
    acc[comp.address].push(comp)
    return acc
  }, {} as Record<string, typeof filteredComparables>)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Market Analysis</h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="map">Market Map</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Space Type
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value || undefined)}
                >
                  <option value="">All Types</option>
                  <option value="Office">Office</option>
                  <option value="Retail">Retail</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    className="flex-1 border border-gray-300 rounded-md p-2"
                    onChange={(e) =>
                      setDateRange(prev => ({
                        start: new Date(e.target.value),
                        end: prev?.end || new Date()
                      }))
                    }
                  />
                  <input
                    type="date"
                    className="flex-1 border border-gray-300 rounded-md p-2"
                    onChange={(e) =>
                      setDateRange(prev => ({
                        start: prev?.start || new Date(),
                        end: new Date(e.target.value)
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Square Footage
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="flex-1 border border-gray-300 rounded-md p-2"
                    onChange={(e) => setMinSqft(Number(e.target.value) || undefined)}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="flex-1 border border-gray-300 rounded-md p-2"
                    onChange={(e) => setMaxSqft(Number(e.target.value) || undefined)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rent ($/SF)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="flex-1 border border-gray-300 rounded-md p-2"
                    onChange={(e) => setMinRent(Number(e.target.value) || undefined)}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="flex-1 border border-gray-300 rounded-md p-2"
                    onChange={(e) => setMaxRent(Number(e.target.value) || undefined)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Leases</p>
                    <p className="text-2xl font-semibold">{filteredComparables.length}</p>
                  </div>
                  <MapPin className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Unique Properties</p>
                    <p className="text-2xl font-semibold">{Object.keys(leasesByAddress).length}</p>
                  </div>
                  <Building2 className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Average Rent</p>
                    <p className="text-2xl font-semibold">
                      ${Math.round(
                        filteredComparables.reduce((sum, comp) => sum + comp.startingRent, 0) /
                          filteredComparables.length
                      )}/SF
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Square Footage</p>
                    <p className="text-2xl font-semibold">
                      {Math.round(
                        filteredComparables.reduce((sum, comp) => sum + comp.transactionSqft, 0) / 1000
                      )}K SF
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex justify-end space-x-2 mb-4">
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
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                List View
              </button>
            </div>
            
            {/* Main Content */}
            {viewMode === 'map' ? (
              <div className="bg-white p-4 rounded-lg shadow">
                <MarketMap
                  comparables={filteredComparables}
                  selectedType={selectedType}
                  dateRange={dateRange}
                  onLeaseSelect={setSelectedLease}
                  starredLeases={starredLeases}
                  onStarLease={handleStarLease}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tenant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Space Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Size (SF)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rent ($/SF)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredComparables
                        .sort((a, b) => new Date(b.executionDate).getTime() - new Date(a.executionDate).getTime())
                        .map((comp, index) => (
                          <tr 
                            key={index} 
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => setSelectedLease(comp)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{comp.address}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{comp.tenantName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                comp.spaceType.toLowerCase().includes('retail')
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {comp.spaceType}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{comp.transactionSqft.toLocaleString()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">${comp.startingRent}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatDate(comp.executionDate)}</div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-medium">Analytics Content</h2>
            <p>Analytics information will go here.</p>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-medium">Reports Content</h2>
            <p>Reports information will go here.</p>
          </div>
        </TabsContent>

        <TabsContent value="map">
          <MarketMapView />
        </TabsContent>
      </Tabs>

      {/* Lease Details Modal */}
      {selectedLease && (
        <LeaseDetails
          lease={selectedLease}
          onClose={() => setSelectedLease(null)}
          onStarLease={handleStarLease}
          isStarred={starredLeases.has(getLeaseId(selectedLease))}
        />
      )}
    </div>
  )
} 