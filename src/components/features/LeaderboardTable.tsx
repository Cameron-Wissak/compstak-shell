'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'

interface LeaderboardTableProps {
  timeRange: string
}

// Sample data - in a real app, this would come from an API
const performers = [
  {
    id: 1,
    name: 'John Smith',
    deals: 24,
    value: '$5.2M',
    conversion: 35,
    trend: 12,
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    deals: 22,
    value: '$4.8M',
    conversion: 32,
    trend: 8,
  },
  {
    id: 3,
    name: 'Michael Brown',
    deals: 20,
    value: '$4.5M',
    conversion: 30,
    trend: -5,
  },
  {
    id: 4,
    name: 'Emily Davis',
    deals: 18,
    value: '$4.1M',
    conversion: 28,
    trend: 15,
  },
  {
    id: 5,
    name: 'David Wilson',
    deals: 16,
    value: '$3.8M',
    conversion: 25,
    trend: -2,
  },
]

export default function LeaderboardTable({ timeRange }: LeaderboardTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Broker
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Deals Closed
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Value
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Conversion Rate
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trend
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {performers.map((performer) => (
            <tr key={performer.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{performer.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{performer.deals}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{performer.value}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{performer.conversion}%</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {performer.trend >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      performer.trend >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {performer.trend >= 0 ? '+' : ''}{performer.trend}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 