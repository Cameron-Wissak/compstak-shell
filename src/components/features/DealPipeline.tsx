'use client'

import { useState, useEffect } from 'react'
import { DollarSign, Calendar, Users, Paperclip, MoreHorizontal, Building2, MapPin, Star, X } from 'lucide-react'
import DealForm from './DealForm'
import DealDetails from './DealDetails'
import { formatCurrency } from '@/utils/formatCurrency'
import { parseCompStakData } from '@/utils/parseComparables'
import { leaseCompsData } from '@/data/leaseComps'

// Sample deal stages - in a real app, these would be configurable
const stages = [
  { id: 'initial', name: 'Initial Inquiry', color: 'bg-gray-50' },
  { id: 'qualification', name: 'Qualification', color: 'bg-blue-50' },
  { id: 'underwriting', name: 'Underwriting', color: 'bg-purple-50' },
  { id: 'loi', name: 'LOI Sent', color: 'bg-yellow-50' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-pink-50' },
  { id: 'contract', name: 'Contract', color: 'bg-green-50' },
  { id: 'closing', name: 'Closing', color: 'bg-teal-50' },
]

// Sample deals data - in a real app, this would come from an API
const initialDeals = [
  {
    id: '1',
    title: 'Downtown Office Complex',
    tenantName: 'Acme Corp',
    address: '123 Main St',
    city: 'New York',
    market: 'Manhattan',
    spaceType: 'Office',
    transactionSqft: 25000,
    floorsOccupied: '15-17',
    executionDate: '2024-02-15',
    leaseTerm: '10 years',
    expirationDate: '2034-02-15',
    tenantOwnership: 'Private',
    transactionQuarter: 'Q1 2024',
    startingRent: 85,
    effectiveRent: 80,
    workValue: 2500000,
    freeRent: '6 months',
    transactionType: 'New Lease',
    rentSchedule: 'Annual 3% increases',
    rentBumpDollar: '',
    rentBumpPercent: '3%',
    comments: 'Prime location with recent renovations',
    stage: 'initial',
    priority: 'high',
    contacts: ['John Smith', 'Sarah Johnson'],
    documents: [
      {
        id: '1',
        name: 'lease_agreement.pdf',
        size: '2.5 MB',
        uploadedBy: 'John Smith',
        version: '1.0',
        uploadDate: '2024-02-15T10:30:00Z',
        type: 'application/pdf'
      },
      {
        id: '2',
        name: 'floor_plans.dwg',
        size: '5.1 MB',
        uploadedBy: 'Sarah Johnson',
        version: '1.0',
        uploadDate: '2024-02-16T14:20:00Z',
        type: 'application/acad'
      }
    ]
  },
  {
    id: '2',
    title: 'Retail Plaza Investment',
    tenantName: 'Retail Co',
    address: '456 Market St',
    city: 'New York',
    market: 'Brooklyn',
    spaceType: 'Retail',
    transactionSqft: 15000,
    floorsOccupied: '1-2',
    executionDate: '2024-02-20',
    leaseTerm: '5 years',
    expirationDate: '2029-02-20',
    tenantOwnership: 'Public',
    transactionQuarter: 'Q1 2024',
    startingRent: 120,
    effectiveRent: 115,
    workValue: 1500000,
    freeRent: '3 months',
    transactionType: 'New Lease',
    rentSchedule: 'Annual increases',
    rentBumpDollar: '5',
    rentBumpPercent: '',
    comments: 'High foot traffic location',
    stage: 'qualification',
    priority: 'medium',
    contacts: ['Mike Brown'],
    documents: [
      {
        id: '3',
        name: 'market_analysis.xlsx',
        size: '1.2 MB',
        uploadedBy: 'Mike Brown',
        version: '2.1',
        uploadDate: '2024-02-19T09:15:00Z',
        type: 'application/vnd.ms-excel'
      }
    ]
  },
  {
    id: '3',
    title: 'Industrial Park Development',
    tenantName: 'Logistics Inc',
    address: '789 Industrial Ave',
    city: 'New York',
    market: 'Queens',
    spaceType: 'Industrial',
    transactionSqft: 50000,
    floorsOccupied: '1',
    executionDate: '2024-03-01',
    leaseTerm: '15 years',
    expirationDate: '2039-03-01',
    tenantOwnership: 'Private',
    transactionQuarter: 'Q1 2024',
    startingRent: 45,
    effectiveRent: 42,
    workValue: 3500000,
    freeRent: '9 months',
    transactionType: 'New Lease',
    rentSchedule: 'Annual 2.5% increases',
    rentBumpDollar: '',
    rentBumpPercent: '2.5%',
    comments: 'Modern distribution facility',
    stage: 'underwriting',
    priority: 'high',
    contacts: ['Emily Davis', 'Tom Wilson'],
    documents: [
      {
        id: '4',
        name: 'site_survey.pdf',
        size: '8.3 MB',
        uploadedBy: 'Emily Davis',
        version: '1.0',
        uploadDate: '2024-02-28T16:45:00Z',
        type: 'application/pdf'
      },
      {
        id: '5',
        name: 'environmental_report.docx',
        size: '3.7 MB',
        uploadedBy: 'Tom Wilson',
        version: '1.1',
        uploadDate: '2024-03-01T11:20:00Z',
        type: 'application/msword'
      }
    ]
  }
]

interface DealCardProps {
  deal: any
  onDragStart: (e: React.DragEvent, dealId: string) => void
  onClick: () => void
}

const DealCard = ({ deal, onDragStart, onClick }: DealCardProps) => {
  const priorityColors = {
    high: 'border-l-4 border-red-500',
    medium: 'border-l-4 border-yellow-500',
    low: 'border-l-4 border-green-500',
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatRent = (rent: number) => {
    return `$${rent}/SF`
  }

  const formatSqft = (sqft: number) => {
    return `${sqft.toLocaleString()} SF`
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, deal.id)}
      onClick={onClick}
      className={`bg-white p-4 rounded-lg shadow-sm cursor-move hover:shadow-md transition-shadow ${
        priorityColors[deal.priority as keyof typeof priorityColors]
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-gray-900 mb-1">{deal.title}</h3>
          <p className="text-sm text-gray-600">{deal.tenantName}</p>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-2.5">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{deal.address}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{deal.spaceType} • {formatSqft(deal.transactionSqft)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{formatRent(deal.startingRent)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{formatDate(deal.executionDate)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Users className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{deal.contacts.join(', ')}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Paperclip className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{deal.documents.length} documents</span>
        </div>
      </div>
    </div>
  )
}

export default function DealPipeline() {
  const [deals, setDeals] = useState(() => {
    // Try to load deals from localStorage
    const savedDeals = localStorage.getItem('deals')
    return savedDeals ? JSON.parse(savedDeals) : initialDeals
  })
  const [selectedDeal, setSelectedDeal] = useState<any>(null)
  const [showDealForm, setShowDealForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [starredLeases, setStarredLeases] = useState<any[]>([])
  const [selectedLease, setSelectedLease] = useState<any>(null)

  // Save deals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('deals', JSON.stringify(deals))
  }, [deals])

  useEffect(() => {
    const savedLeases = localStorage.getItem('starredLeases')
    if (savedLeases) {
      setStarredLeases(JSON.parse(savedLeases))
    }
  }, [])

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('dealId', dealId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetStage: string) => {
    e.preventDefault()
    const dealId = e.dataTransfer.getData('dealId')
    const updatedDeals = deals.map((deal: any) =>
      deal.id === dealId ? { ...deal, stage: targetStage } : deal
    )
    setDeals(updatedDeals)
  }

  const handleDealSubmit = (dealData: any) => {
    if (dealData.id) {
      // Update existing deal
      setDeals(deals.map((deal: any) =>
        deal.id === dealData.id ? { ...dealData } : deal
      ))
    } else {
      // Add new deal
      const newDeal = {
        ...dealData,
        id: Date.now().toString(),
        documents: [],
        stage: 'initial',
      }
      setDeals([...deals, newDeal])
    }
    setShowDealForm(false)
  }

  const handleDealClick = (deal: any) => {
    setSelectedDeal(deal)
    setShowDetails(true)
  }

  const handleDealUpdate = (updatedDeal: any) => {
    const updatedDeals = deals.map((deal: any) =>
      deal.id === updatedDeal.id ? updatedDeal : deal
    )
    setDeals(updatedDeals)
    setSelectedDeal(null)
  }

  const getComparableDetails = (comparableId: string) => {
    const [address, tenantName] = comparableId.split('-')
    return { address, tenantName }
  }

  const handleComparableClick = (comparableId: string) => {
    const allLeases = parseCompStakData(leaseCompsData)
    const [address, tenantName] = comparableId.split('-')
    const lease = allLeases.find(l => 
      l.address === address && l.tenantName === tenantName
    )
    setSelectedLease(lease)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Deal Pipeline</h1>
        <button
          onClick={() => setShowDealForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Deal
        </button>
      </div>

      <div className="flex overflow-x-auto space-x-4 pb-6">
        {stages.map((stage) => (
          <div
            key={stage.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id)}
            className={`flex-none w-[300px] ${stage.color} p-4 rounded-lg min-h-[500px]`}
          >
            <h2 className="font-semibold mb-4">{stage.name}</h2>
            <div className="space-y-3">
              {deals
                .filter((deal: any) => deal.stage === stage.id)
                .map((deal: any) => (
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    onDragStart={handleDragStart}
                    onClick={() => handleDealClick(deal)}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      {showDealForm && (
        <DealForm
          onClose={() => setShowDealForm(false)}
          onSubmit={handleDealSubmit}
        />
      )}

      {showDetails && selectedDeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-semibold">{selectedDeal.title}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedDeal(null)
                    setShowDealForm(true)
                  }}
                  className="px-4 py-2 text-blue-600 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    const updatedDeals = deals.filter((d: { id: string }) => d.id !== selectedDeal.id)
                    setDeals(updatedDeals)
                    localStorage.setItem('deals', JSON.stringify(updatedDeals))
                    setShowDetails(false)
                    setSelectedDeal(null)
                  }}
                  className="px-4 py-2 text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-700"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Property Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Address</label>
                    <p className="font-medium">{selectedDeal.address}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">City</label>
                    <p className="font-medium">{selectedDeal.city}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Market</label>
                    <p className="font-medium">{selectedDeal.market}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Space Type</label>
                    <p className="font-medium">{selectedDeal.spaceType}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Transaction SQFT</label>
                    <p className="font-medium">{parseInt(selectedDeal.transactionSqft).toLocaleString()} SF</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Floors Occupied</label>
                    <p className="font-medium">{selectedDeal.floorsOccupied}</p>
                  </div>
                </div>

                <h3 className="text-lg font-medium mt-8 mb-4">Lease Terms</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Execution Date</label>
                    <p className="font-medium">{selectedDeal.executionDate}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Lease Term</label>
                    <p className="font-medium">{selectedDeal.leaseTerm} years</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Expiration Date</label>
                    <p className="font-medium">{selectedDeal.expirationDate}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Transaction Type</label>
                    <p className="font-medium">{selectedDeal.transactionType}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Transaction Quarter</label>
                    <p className="font-medium">{selectedDeal.transactionQuarter}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Financial Terms</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Starting Rent</label>
                    <p className="font-medium">{formatCurrency(parseFloat(selectedDeal.startingRent))}/SF/Year</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Effective Rent</label>
                    <p className="font-medium">{formatCurrency(parseFloat(selectedDeal.effectiveRent))}/SF/Year</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Work Value</label>
                    <p className="font-medium">{formatCurrency(parseFloat(selectedDeal.workValue))}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Free Rent</label>
                    <p className="font-medium">{selectedDeal.freeRent} months</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Rent Schedule</label>
                    <p className="font-medium whitespace-pre-line">{selectedDeal.rentSchedule}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Rent Bumps</label>
                    <p className="font-medium">
                      {selectedDeal.rentBumpDollar && `$${selectedDeal.rentBumpDollar}`}
                      {selectedDeal.rentBumpDollar && selectedDeal.rentBumpPercent && ' or '}
                      {selectedDeal.rentBumpPercent && `${selectedDeal.rentBumpPercent}`}
                    </p>
                  </div>
                </div>

                <h3 className="text-lg font-medium mt-8 mb-4">Contacts</h3>
                <div className="space-y-2">
                  {selectedDeal.contacts.map((contact: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{contact}</span>
                    </div>
                  ))}
                </div>

                {selectedDeal.comparables && selectedDeal.comparables.length > 0 && (
                  <>
                    <h3 className="text-lg font-medium mt-8 mb-4">Comparable Leases</h3>
                    <div className="space-y-3">
                      {selectedDeal.comparables.map((comparableId: string) => {
                        const { address, tenantName } = getComparableDetails(comparableId)
                        return (
                          <div 
                            key={comparableId} 
                            className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                            onClick={() => handleComparableClick(comparableId)}
                          >
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <div>
                              <p className="font-medium">{address}</p>
                              <p className="text-sm text-gray-600">{tenantName}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            {selectedDeal.comments && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Comments</h3>
                <p className="whitespace-pre-line">{selectedDeal.comments}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedLease && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold">Lease Details</h2>
              <button
                onClick={() => setSelectedLease(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Property</h3>
                  <p className="mt-1 text-lg">{selectedLease.address}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Tenant</h3>
                  <p className="mt-1 text-lg">{selectedLease.tenantName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Market</h3>
                  <p className="mt-1">{selectedLease.market}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Space Type</h3>
                  <p className="mt-1">{selectedLease.spaceType}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Transaction Size</h3>
                  <p className="mt-1">{selectedLease.transactionSqft.toLocaleString()} SF</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Floors Occupied</h3>
                  <p className="mt-1">{selectedLease.floorsOccupied || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Starting Rent</h3>
                  <p className="mt-1">${selectedLease.startingRent}/SF/Year</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Effective Rent</h3>
                  <p className="mt-1">${selectedLease.effectiveRent}/SF/Year</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Execution Date</h3>
                  <p className="mt-1">{selectedLease.executionDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Lease Term</h3>
                  <p className="mt-1">{selectedLease.leaseTerm}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Free Rent</h3>
                  <p className="mt-1">{selectedLease.freeRent || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Work Value</h3>
                  <p className="mt-1">${selectedLease.workValue || '0'}</p>
                </div>
              </div>

              {selectedLease.comments && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Comments</h3>
                  <p className="text-gray-700 whitespace-pre-line">{selectedLease.comments}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 