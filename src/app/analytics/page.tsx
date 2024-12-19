'use client'

import PerformanceChart from '@/components/features/PerformanceChart'
import LeaderboardTable from '@/components/features/LeaderboardTable'
import { BarChart2, TrendingUp, Users, DollarSign } from 'lucide-react'

const metrics = [
  {
    title: 'Total Deals',
    value: '156',
    change: '+12%',
    isPositive: true,
    icon: BarChart2,
  },
  {
    title: 'Revenue',
    value: '$2.4M',
    change: '+8%',
    isPositive: true,
    icon: DollarSign,
  },
  {
    title: 'Active Clients',
    value: '64',
    change: '+5%',
    isPositive: true,
    icon: Users,
  },
  {
    title: 'Conversion Rate',
    value: '28%',
    change: '-2%',
    isPositive: false,
    icon: TrendingUp,
  },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.title} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {metric.value}
                  </p>
                  <p className="mt-2 text-sm">
                    <span
                      className={`font-medium ${
                        metric.isPositive ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {metric.change}
                    </span>
                    <span className="text-gray-600"> from last month</span>
                  </p>
                </div>
                <div
                  className={`rounded-full p-3 ${
                    metric.isPositive ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <Icon
                    className={`h-6 w-6 ${
                      metric.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Performance Overview</h2>
          <PerformanceChart timeRange="last-30-days" />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Top Performers</h2>
          <LeaderboardTable timeRange="last-30-days" />
        </div>
      </div>
    </div>
  )
} 