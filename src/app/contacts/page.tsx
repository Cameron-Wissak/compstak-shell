'use client'

import { useState } from 'react'
import ContactForm from '@/components/features/ContactForm'
import ContactDetails from '@/components/features/ContactDetails'
import { Plus, Mail, Phone, Building2 } from 'lucide-react'

// Sample contacts data - in a real app, this would come from an API
const initialContacts = [
  {
    id: '1',
    name: 'John Smith',
    company: 'ABC Properties',
    role: 'Investment Manager',
    email: 'john.smith@abcproperties.com',
    phone: '(555) 123-4567',
    type: 'Investor',
    lastContact: '2024-01-10',
    properties: ['123 Main St', '456 Oak Ave'],
    deals: ['Downtown Office Complex', 'Retail Plaza Investment'],
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'XYZ Real Estate',
    role: 'Property Manager',
    email: 'sarah.j@xyzrealestate.com',
    phone: '(555) 987-6543',
    type: 'Property Manager',
    lastContact: '2024-01-12',
    properties: ['789 Pine St', '321 Elm Rd'],
    deals: ['Industrial Park Development'],
  },
]

export default function ContactsPage() {
  const [contacts, setContacts] = useState(initialContacts)
  const [showContactForm, setShowContactForm] = useState(false)
  const [selectedContact, setSelectedContact] = useState<any>(null)

  const handleContactSubmit = (contact: any) => {
    // In a real app, this would save to an API
    console.log('New contact:', contact)
    setShowContactForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Contacts</h1>
        <button
          onClick={() => setShowContactForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Contact
        </button>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedContact(contact)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{contact.name}</h3>
                <p className="text-sm text-gray-500">{contact.role}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                <span>{contact.company}</span>
              </div>
              <div className="flex items-center text-sm">
                <Mail className="w-4 h-4 text-gray-400 mr-2" />
                <span>{contact.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 text-gray-400 mr-2" />
                <span>{contact.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showContactForm && (
        <ContactForm
          onClose={() => setShowContactForm(false)}
          onSubmit={handleContactSubmit}
        />
      )}

      {selectedContact && (
        <ContactDetails
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onUpdate={(updatedContact) => {
            // In a real app, this would save to an API
            console.log('Updated contact:', updatedContact)
            setSelectedContact(null)
          }}
        />
      )}
    </div>
  )
} 