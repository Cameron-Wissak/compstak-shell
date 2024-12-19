'use client'

import { X, Building2, MapPin, Calendar, DollarSign, Users, ArrowUpRight, Clock, FileText, Star } from 'lucide-react'
import { ParsedComparable } from '@/utils/parseComparables'

interface LeaseDetailsProps {
  lease: ParsedComparable
  onClose: () => void
  onStarLease?: (lease: ParsedComparable) => void
  isStarred?: boolean
}

export default function LeaseDetails({ lease, onClose, onStarLease, isStarred = false }: LeaseDetailsProps) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold">{lease.tenantName || 'Undisclosed Tenant'}</h2>
            <p className="text-gray-500 mt-1">{lease.address}</p>
          </div>
          <div className="flex items-center space-x-4">
            {onStarLease && (
              <button
                onClick={() => onStarLease(lease)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Star 
                  className={`w-5 h-5 ${
                    isStarred
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-400'
                  }`}
                />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 83px)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Property Information */}
            <section>
              <h3 className="text-lg font-medium mb-4">Property Information</h3>
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Building2 className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Space Type</p>
                    <p className="font-medium">{lease.spaceType || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{lease.city}, {lease.market}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowUpRight className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Size</p>
                    <p className="font-medium">{lease.transactionSqft.toLocaleString()} SF</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Building2 className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Floors</p>
                    <p className="font-medium">{lease.floorsOccupied || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Lease Terms */}
            <section>
              <h3 className="text-lg font-medium mb-4">Lease Terms</h3>
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Execution Date</p>
                    <p className="font-medium">{formatDate(lease.executionDate)}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Lease Term</p>
                    <p className="font-medium">{lease.leaseTerm || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Expiration</p>
                    <p className="font-medium">{lease.expirationDate || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Tenant Type</p>
                    <p className="font-medium">{lease.tenantOwnership || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Quarter</p>
                    <p className="font-medium">{lease.transactionQuarter || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Financial Terms */}
            <section>
              <h3 className="text-lg font-medium mb-4">Financial Terms</h3>
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <DollarSign className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Starting Rent</p>
                    <p className="font-medium">{formatRent(lease.startingRent)}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <DollarSign className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Effective Rent</p>
                    <p className="font-medium">{formatRent(lease.effectiveRent)}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <DollarSign className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Work Value</p>
                    <p className="font-medium">{formatMoney(lease.workValue)}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Free Rent</p>
                    <p className="font-medium">{lease.freeRent || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Additional Details */}
            <section>
              <h3 className="text-lg font-medium mb-4">Additional Details</h3>
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Transaction Type</p>
                    <p className="font-medium">{lease.transactionType || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <DollarSign className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Rent Schedule</p>
                    <p className="font-medium">{lease.rentSchedule || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowUpRight className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Rent Bumps</p>
                    <p className="font-medium">
                      {lease.rentBumpDollar ? `$${lease.rentBumpDollar}` : ''}
                      {lease.rentBumpDollar && lease.rentBumpPercent ? ' / ' : ''}
                      {lease.rentBumpPercent || ''}
                      {!lease.rentBumpDollar && !lease.rentBumpPercent ? 'N/A' : ''}
                    </p>
                  </div>
                </div>
                {lease.comments && (
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Comments</p>
                      <p className="font-medium">{lease.comments}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
} 