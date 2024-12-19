'use client'

import './globals.css'
import 'leaflet/dist/leaflet.css'
import DashboardLayout from '@/components/layout/DashboardLayout'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>CRE Management Dashboard</title>
        <meta name="description" content="Commercial Real Estate Management Dashboard" />
      </head>
      <body>
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  )
} 