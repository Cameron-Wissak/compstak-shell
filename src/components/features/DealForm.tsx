'use client'

import { useState, useEffect } from 'react'
import { Building, DollarSign, Calendar, Users, X, Star } from 'lucide-react'
import { ParsedComparable } from '@/utils/parseComparables'
import { parseCompStakData } from '@/utils/parseComparables'
import { leaseCompsData } from '@/data/leaseComps'

interface DealFormProps {
  onClose: () => void
  onSubmit: (deal: any) => void
  initialData?: any
}

const propertyTypes = ['Office', 'Retail', 'Industrial', 'Mixed-Use', 'Residential', 'Land']
const priorities = ['low', 'medium', 'high']
const transactionTypes = ['New Lease', 'Renewal', 'Expansion', 'Relocation', 'Sublease']

export default function DealForm({ onClose, onSubmit, initialData }: DealFormProps) {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    tenantName: '',
    address: '',
    city: '',
    market: '',
    spaceType: 'Office',
    transactionSqft: '',
    floorsOccupied: '',
    executionDate: '',
    leaseTerm: '',
    expirationDate: '',
    tenantOwnership: '',
    transactionQuarter: '',
    startingRent: '',
    effectiveRent: '',
    workValue: '',
    freeRent: '',
    transactionType: 'New Lease',
    rentSchedule: '',
    rentBumpDollar: '',
    rentBumpPercent: '',
    comments: '',
    priority: 'medium',
    stage: 'Initial Inquiry',
    contacts: [''],
    comparables: [] // Array to store selected comparable leases
  })

  const [starredLeases, setStarredLeases] = useState<ParsedComparable[]>([])
  const [selectedComparables, setSelectedComparables] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Load starred leases from localStorage
    const savedLeaseIds = localStorage.getItem('starredLeases')
    if (savedLeaseIds) {
      try {
        const leaseIds = JSON.parse(savedLeaseIds)
        setSelectedComparables(new Set(leaseIds))
        
        // Load the actual lease data
        const allLeases = parseCompStakData(leaseCompsData)
        const starredLeaseData = allLeases.filter(lease => {
          const leaseId = `${lease.address}-${lease.tenantName}-${lease.executionDate}`
          return leaseIds.includes(leaseId)
        })
        setStarredLeases(starredLeaseData)
        
        // If we have initial data with comparables, add them to selected
        if (initialData?.comparables) {
          setSelectedComparables(new Set([...leaseIds, ...initialData.comparables]))
        }
      } catch (error) {
        console.error('Error parsing starred leases:', error)
      }
    }
  }, [initialData])

  const handleContactChange = (index: number, value: string) => {
    const newContacts = [...formData.contacts]
    newContacts[index] = value
    setFormData({ ...formData, contacts: newContacts })
  }

  const addContact = () => {
    setFormData({ ...formData, contacts: [...formData.contacts, ''] })
  }

  const removeContact = (index: number) => {
    const newContacts = formData.contacts.filter((_: string, i: number) => i !== index)
    setFormData({ ...formData, contacts: newContacts })
  }

  const toggleComparable = (leaseId: string) => {
    const newSelected = new Set(selectedComparables)
    if (newSelected.has(leaseId)) {
      newSelected.delete(leaseId)
    } else {
      newSelected.add(leaseId)
    }
    setSelectedComparables(newSelected)
    
    // Update form data with selected comparables
    setFormData({
      ...formData,
      comparables: Array.from(newSelected)
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      comparables: Array.from(selectedComparables)
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">{initialData ? 'Edit Deal' : 'New Deal'}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deal Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tenant Name
              </label>
              <input
                type="text"
                value={formData.tenantName}
                onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Location Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Market
              </label>
              <input
                type="text"
                value={formData.market}
                onChange={(e) => setFormData({ ...formData, market: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Space Type
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <select
                  value={formData.spaceType}
                  onChange={(e) => setFormData({ ...formData, spaceType: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction SQFT
              </label>
              <input
                type="number"
                value={formData.transactionSqft}
                onChange={(e) => setFormData({ ...formData, transactionSqft: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Floors Occupied
              </label>
              <input
                type="text"
                value={formData.floorsOccupied}
                onChange={(e) => setFormData({ ...formData, floorsOccupied: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Lease Terms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Execution Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.executionDate}
                  onChange={(e) => setFormData({ ...formData, executionDate: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lease Term (years)
              </label>
              <input
                type="text"
                value={formData.leaseTerm}
                onChange={(e) => setFormData({ ...formData, leaseTerm: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiration Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Financial Terms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Starting Rent ($/SF/Year)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={formData.startingRent}
                  onChange={(e) => setFormData({ ...formData, startingRent: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Effective Rent ($/SF/Year)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={formData.effectiveRent}
                  onChange={(e) => setFormData({ ...formData, effectiveRent: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work Value ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={formData.workValue}
                  onChange={(e) => setFormData({ ...formData, workValue: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Additional Terms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Free Rent (months)
              </label>
              <input
                type="text"
                value={formData.freeRent}
                onChange={(e) => setFormData({ ...formData, freeRent: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Type
              </label>
              <select
                value={formData.transactionType}
                onChange={(e) => setFormData({ ...formData, transactionType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {transactionTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Quarter
              </label>
              <input
                type="text"
                value={formData.transactionQuarter}
                onChange={(e) => setFormData({ ...formData, transactionQuarter: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. Q1 2024"
              />
            </div>
          </div>

          {/* Rent Escalations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rent Schedule
              </label>
              <textarea
                value={formData.rentSchedule}
                onChange={(e) => setFormData({ ...formData, rentSchedule: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3}
                placeholder="Enter rent schedule details"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rent Bump ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.rentBumpDollar}
                    onChange={(e) => setFormData({ ...formData, rentBumpDollar: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rent Bump (%)
                </label>
                <input
                  type="text"
                  value={formData.rentBumpPercent}
                  onChange={(e) => setFormData({ ...formData, rentBumpPercent: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. 3%"
                />
              </div>
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comments
            </label>
            <textarea
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={3}
            />
          </div>

          {/* Deal Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {priorities.map(priority => (
                  <option key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stage
              </label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Initial Inquiry">Initial Inquiry</option>
                <option value="Qualification">Qualification</option>
                <option value="Underwriting">Underwriting</option>
                <option value="LOI Sent">LOI Sent</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Contract">Contract</option>
                <option value="Closing">Closing</option>
              </select>
            </div>
          </div>

          {/* Contacts */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contacts
            </label>
            {formData.contacts.map((contact: string, index: number) => (
              <div key={index} className="flex gap-2 mb-2">
                <div className="relative flex-1">
                  <Users className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => handleContactChange(index, e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Contact name"
                  />
                </div>
                {formData.contacts.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeContact(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addContact}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              + Add Contact
            </button>
          </div>

          {/* Comparable Leases */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comparable Leases
            </label>
            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
              {starredLeases.length > 0 ? (
                starredLeases.map((lease) => {
                  const leaseId = `${lease.address}-${lease.tenantName}-${lease.executionDate}`
                  return (
                    <div key={leaseId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{lease.address}</p>
                        <p className="text-sm text-gray-600">
                          {lease.tenantName} • {lease.transactionSqft.toLocaleString()} SF • ${lease.startingRent}/SF
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleComparable(leaseId)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <Star 
                          className={`w-5 h-5 ${
                            selectedComparables.has(leaseId)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-400'
                          }`}
                        />
                      </button>
                    </div>
                  )
                })
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No starred leases yet. Star leases from the Market Analysis tab to use them as comparables.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {initialData ? 'Update Deal' : 'Create Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 