'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface DealsPipelineChartProps {
  timeRange: string
}

// Sample data - in a real app, this would come from an API
const data = [
  {
    stage: 'Initial Inquiry',
    count: 45,
    value: 12500000,
  },
  {
    stage: 'Qualification',
    count: 32,
    value: 8900000,
  },
  {
    stage: 'Underwriting',
    count: 28,
    value: 7200000,
  },
  {
    stage: 'LOI Sent',
    count: 20,
    value: 5500000,
  },
  {
    stage: 'Negotiation',
    count: 15,
    value: 4200000,
  },
  {
    stage: 'Contract',
    count: 10,
    value: 2800000,
  },
  {
    stage: 'Closing',
    count: 6,
    value: 1500000,
  },
]

const formatValue = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`
  }
  return `$${value}`
}

export default function DealsPipelineChart({ timeRange }: DealsPipelineChartProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="stage" angle={-45} textAnchor="end" height={80} />
          <YAxis yAxisId="left" orientation="left" stroke="#2563eb" />
          <YAxis yAxisId="right" orientation="right" stroke="#16a34a" />
          <Tooltip
            formatter={(value: any, name: string) => {
              if (name === 'value') {
                return formatValue(value)
              }
              return value
            }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="count" name="Number of Deals" fill="#2563eb" />
          <Bar yAxisId="right" dataKey="value" name="Total Value" fill="#16a34a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
} 