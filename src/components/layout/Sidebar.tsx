"use client";

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Building, Users, BarChart, Calendar, Settings, LayoutDashboard, Map } from "lucide-react";

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Deals', href: '/deals', icon: BarChart },
  { name: 'Properties', href: '/properties', icon: Building },
  { name: 'Market Analysis', href: '/market-analysis', icon: Map },
  { name: 'Contacts', href: '/contacts', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto hidden md:block">
      <div className="p-4">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-[#3B5BDB] rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900 leading-none">CompStak</span>
            <span className="text-2xl font-bold text-gray-900 leading-none">CRM</span>
          </div>
        </Link>
      </div>
      <nav className="px-4 pb-6 space-y-1 mt-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  );
} 