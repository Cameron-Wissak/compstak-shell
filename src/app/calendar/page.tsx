'use client'

import { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

// Sample events - in a real app, this would come from an API
const initialEvents = [
  {
    id: '1',
    title: 'Property Viewing - 123 Main St',
    start: '2024-01-15T10:00:00',
    end: '2024-01-15T11:00:00',
    backgroundColor: '#2563eb',
  },
  {
    id: '2',
    title: 'Client Meeting - Johnson Deal',
    start: '2024-01-16T14:00:00',
    end: '2024-01-16T15:30:00',
    backgroundColor: '#16a34a',
  },
  {
    id: '3',
    title: 'Property Inspection - 456 Oak Ave',
    start: '2024-01-17T09:00:00',
    end: '2024-01-17T10:30:00',
    backgroundColor: '#9333ea',
  },
]

export default function CalendarPage() {
  const [events, setEvents] = useState(initialEvents)

  const handleEventClick = (clickInfo: any) => {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'?`)) {
      clickInfo.event.remove()
    }
  }

  const handleDateSelect = (selectInfo: any) => {
    const title = prompt('Please enter a title for your event:')
    if (title) {
      const newEvent = {
        id: String(events.length + 1),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        backgroundColor: '#2563eb',
      }
      setEvents([...events, newEvent])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Calendar</h1>
        <div className="text-sm text-gray-500">
          Click on a date to add an event • Click on an event to delete
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          select={handleDateSelect}
          eventClick={handleEventClick}
          height="800px"
        />
      </div>
    </div>
  )
} 