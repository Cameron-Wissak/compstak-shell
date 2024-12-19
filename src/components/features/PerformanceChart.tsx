'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface PerformanceChartProps {
  timeRange: string
}

// Sample data - in a real app, this would come from an API
const data = [
  { name: 'Jan', deals: 65, revenue: 4000, conversion: 24 },
  { name: 'Feb', deals: 59, revenue: 3500, conversion: 22 },
  { name: 'Mar', deals: 80, revenue: 5000, conversion: 28 },
  { name: 'Apr', deals: 81, revenue: 5200, conversion: 30 },
  { name: 'May', deals: 56, revenue: 3800, conversion: 20 },
  { name: 'Jun', deals: 55, revenue: 3600, conversion: 21 },
  { name: 'Jul', deals: 72, revenue: 4800, conversion: 26 },
]

export default function PerformanceChart({ timeRange }: PerformanceChartProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="deals"
            stroke="#2563eb"
            activeDot={{ r: 8 }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="revenue"
            stroke="#16a34a"
            activeDot={{ r: 8 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="conversion"
            stroke="#9333ea"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 