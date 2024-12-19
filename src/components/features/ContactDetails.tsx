'use client'

import { useState } from 'react'
import { Mail, Phone, Building2, Calendar, FileText, MessageSquare, Clock, Edit } from 'lucide-react'
import ContactForm from './ContactForm'

interface Contact {
  id: string
  name: string
  company: string
  role: string
  email: string
  phone: string
  type: string
  lastContact: string
  properties: string[]
  deals: string[]
}

interface ContactDetailsProps {
  contact: Contact
  onClose: () => void
  onUpdate: (contact: Contact) => void
}

const activities = [
  {
    type: 'email',
    description: 'Sent follow-up email about Downtown Office proposal',
    date: '2024-01-15 14:30',
    icon: Mail,
  },
  {
    type: 'call',
    description: 'Phone call discussing investment opportunities',
    date: '2024-01-12 11:00',
    icon: Phone,
  },
  {
    type: 'meeting',
    description: 'Property tour at Industrial Park',
    date: '2024-01-10 09:00',
    icon: Building2,
  },
]

export default function ContactDetails({ contact, onClose, onUpdate }: ContactDetailsProps) {
  const [showEditForm, setShowEditForm] = useState(false)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {showEditForm ? (
          <ContactForm
            initialData={contact}
            onClose={() => setShowEditForm(false)}
            onSubmit={(updatedContact) => {
              onUpdate(updatedContact)
              setShowEditForm(false)
            }}
          />
        ) : (
          <>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-semibold">{contact.name}</h2>
                <p className="text-gray-600">{contact.role} at {contact.company}</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowEditForm(true)}
                  className="flex items-center text-blue-600 hover:text-blue-700"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                <section>
                  <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-3" />
                      <span>{contact.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-400 mr-3" />
                      <span>{contact.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                      <span>{contact.company}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                      <span>Last Contact: {contact.lastContact}</span>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-medium mb-4">Activity History</h3>
                  <div className="space-y-4">
                    {activities.map((activity, index) => {
                      const Icon = activity.icon
                      return (
                        <div key={index} className="flex items-start">
                          <div className="flex-shrink-0">
                            <Icon className="w-5 h-5 text-gray-400 mt-1" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm text-gray-900">{activity.description}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-medium mb-4">Related Properties</h3>
                  <div className="space-y-2">
                    {contact.properties.map((property, index) => (
                      <div
                        key={index}
                        className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                      >
                        <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                        <span>{property}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-medium mb-4">Active Deals</h3>
                  <div className="space-y-2">
                    {contact.deals.map((deal, index) => (
                      <div
                        key={index}
                        className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-gray-400 mr-2" />
                        <span>{deal}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Message
                    </button>
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                      <Clock className="w-4 h-4 mr-2" />
                      Schedule Meeting
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 