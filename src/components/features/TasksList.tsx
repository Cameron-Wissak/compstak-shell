'use client'

import { Calendar, CheckCircle, Clock } from 'lucide-react'

const tasks = [
  { title: "Call with landlord", due: "Today 4pm", icon: Calendar, done: false },
  { title: "Prepare lease proposal", due: "Tomorrow", icon: Clock, done: false },
  { title: "Finalize deal docs", due: "Friday", icon: CheckCircle, done: true },
]

export default function TasksList() {
  return (
    <div className="border border-gray-200 bg-white rounded shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Upcoming Tasks</h3>
      </div>
      <ul className="p-4 space-y-3">
        {tasks.map((task, idx) => (
          <li key={idx} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <task.icon className={`w-5 h-5 ${task.done ? "text-green-600" : "text-gray-600"}`} />
              <span className={`${task.done ? "line-through text-gray-400" : ""}`}>{task.title}</span>
            </div>
            <span className="text-sm text-gray-500">{task.due}</span>
          </li>
        ))}
      </ul>
    </div>
  )
} 