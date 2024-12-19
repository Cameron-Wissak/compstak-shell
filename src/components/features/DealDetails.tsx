'use client'

import { useState } from 'react'
import {
  Building2,
  Calendar,
  DollarSign,
  Users,
  FileText,
  Paperclip,
  Upload,
  Download,
  Clock,
  X,
  MapPin,
  ArrowUpRight,
} from 'lucide-react'
import { getDocumentColor, getDocumentIcon, formatFileSize } from '@/utils/documentUtils'

interface DealDetailsProps {
  deal: any
  onClose: () => void
  onUpdate: (deal: any) => void
}

export default function DealDetails({ deal, onClose, onUpdate }: DealDetailsProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'documents', label: 'Documents' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'tasks', label: 'Tasks' },
  ]

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  const formatMoney = (value: number | string | undefined) => {
    if (!value) return 'N/A'
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    return `$${numValue.toLocaleString()}`
  }

  const formatRent = (value: number | string | undefined) => {
    if (!value) return 'N/A'
    return `${formatMoney(value)}/SF/Year`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold">{deal.title || deal.tenantName || 'Undisclosed'}</h2>
            <p className="text-gray-500 mt-1">{deal.address}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 83px)' }}>
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Property Information */}
              <section>
                <h3 className="text-lg font-semibold mb-4">Property Information</h3>
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Building2 className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Space Type</p>
                      <p className="font-medium">{deal.spaceType || deal.propertyType || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">{deal.city ? `${deal.city}, ${deal.market}` : deal.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <ArrowUpRight className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Size</p>
                      <p className="font-medium">{deal.transactionSqft ? `${deal.transactionSqft.toLocaleString()} SF` : 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Building2 className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Floors</p>
                      <p className="font-medium">{deal.floorsOccupied || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Lease Terms */}
              <section>
                <h3 className="text-lg font-semibold mb-4">Lease Terms</h3>
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Execution Date</p>
                      <p className="font-medium">{formatDate(deal.executionDate || deal.dueDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Lease Term</p>
                      <p className="font-medium">{deal.leaseTerm || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Expiration</p>
                      <p className="font-medium">{deal.expirationDate || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Tenant Type</p>
                      <p className="font-medium">{deal.tenantOwnership || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Quarter</p>
                      <p className="font-medium">{deal.transactionQuarter || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Financial Terms */}
              <section>
                <h3 className="text-lg font-semibold mb-4">Financial Terms</h3>
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <DollarSign className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Starting Rent</p>
                      <p className="font-medium">{formatRent(deal.startingRent || deal.value)}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <DollarSign className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Effective Rent</p>
                      <p className="font-medium">{formatRent(deal.effectiveRent)}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <DollarSign className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Work Value</p>
                      <p className="font-medium">{formatMoney(deal.workValue)}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Free Rent</p>
                      <p className="font-medium">{deal.freeRent || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Additional Details */}
              <section>
                <h3 className="text-lg font-semibold mb-4">Additional Details</h3>
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Transaction Type</p>
                      <p className="font-medium">{deal.transactionType || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <DollarSign className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Rent Schedule</p>
                      <p className="font-medium">{deal.rentSchedule || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <ArrowUpRight className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Rent Bumps</p>
                      <p className="font-medium">
                        {deal.rentBumpDollar ? `$${deal.rentBumpDollar}` : ''}
                        {deal.rentBumpDollar && deal.rentBumpPercent ? ' / ' : ''}
                        {deal.rentBumpPercent || ''}
                        {!deal.rentBumpDollar && !deal.rentBumpPercent ? 'N/A' : ''}
                      </p>
                    </div>
                  </div>
                  {deal.comments && (
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Comments</p>
                        <p className="font-medium">{deal.comments}</p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Documents</h3>
                <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0]
                        const newDoc = {
                          id: Date.now().toString(),
                          name: file.name,
                          size: formatFileSize(file.size),
                          uploadedBy: 'Current User',
                          version: '1.0',
                          uploadDate: new Date().toISOString(),
                          type: file.type,
                        }
                        const updatedDeal = {
                          ...deal,
                          documents: [...(deal.documents || []), newDoc],
                        }
                        onUpdate(updatedDeal)
                      }
                    }} 
                  />
                </label>
              </div>

              <div className="space-y-4">
                {(deal.documents || []).map((doc: any) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getDocumentColor(doc.name)}`}>
                        <span className="text-lg font-semibold">{getDocumentIcon(doc.name)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">
                          {doc.size} • Uploaded by {doc.uploadedBy} • {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-2 text-gray-400 hover:text-gray-600"
                        onClick={() => {
                          const updatedDocs = deal.documents.filter((d: any) => d.id !== doc.id)
                          const updatedDeal = { ...deal, documents: updatedDocs }
                          onUpdate(updatedDeal)
                        }}
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-blue-600 hover:text-blue-700">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {(!deal.documents || deal.documents.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <Paperclip className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No documents uploaded yet</p>
                    <p className="text-sm">Upload documents to get started</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Activity Timeline</h3>
              {/* Timeline content would go here */}
            </div>
          )}

          {activeTab === 'tasks' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Related Tasks</h3>
              {/* Tasks content would go here */}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 