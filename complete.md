CRE Management Dashboard Code Overview
This document consolidates all code and instructions into a single file for easy sharing. In practice, you’d split these into separate files and directories as indicated. This solution includes:

next.config.js with image remotePatterns setup.
Root layout.tsx with sidebar and header navigation.
page.tsx file updated with metrics cards, property map, and tasks.
Tailwind CSS styling and responsive layouts.
Lucide React icons.
Images from picsum.photos.
Proper @/ path imports.
use client directives in client-side components.
Note:
Ensure you have your Tailwind and @/ aliases configured correctly in your project. The @/ aliases require proper tsconfig.json setup. Also, ensure lucide-react is installed (npm install lucide-react) and that Tailwind is configured.

next.config.js
js
Copy code
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
Project Structure (Suggested)
css
Copy code
.
├─ next.config.js
└─ src/
   ├─ app/
   │  ├─ layout.tsx
   │  └─ page.tsx
   ├─ components/
   │  ├─ layout/
   │  │  ├─ Header.tsx
   │  │  └─ Sidebar.tsx
   │  ├─ features/
   │  │  ├─ MetricsCards.tsx
   │  │  ├─ PropertyMap.tsx
   │  │  └─ TasksList.tsx
   │  └─ shared/
   ├─ styles/
   │  └─ globals.css
   ├─ utils/
   └─ ...
src/app/layout.tsx
tsx
Copy code
import "./globals.css";
import { ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export const metadata = {
  title: "Commercial Real Estate (CRE) Management Dashboard",
  description: "A comprehensive CRE dashboard"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-800">
        <div className="h-screen flex flex-col">
          {/* Top Header */}
          <Header />

          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
src/app/page.tsx
tsx
Copy code
import MetricsCards from "@/components/features/MetricsCards";
import PropertyMap from "@/components/features/PropertyMap";
import TasksList from "@/components/features/TasksList";

export default function Page() {
  return (
    <div className="space-y-8">
      {/* KPI / Metrics Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
        <MetricsCards />
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Property Map Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Properties Overview</h2>
          <PropertyMap />
        </div>

        {/* Upcoming Tasks Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Upcoming Tasks</h2>
          <TasksList />
        </div>
      </section>
    </div>
  );
}
src/components/layout/Header.tsx
tsx
Copy code
"use client";

import { Download, FilePlus } from "lucide-react";

export default function Header() {
  return (
    <header className="h-16 flex items-center justify-between border-b border-gray-200 px-6 bg-white">
      <div className="font-bold text-xl">CRE Dashboard</div>
      <div className="space-x-4 flex items-center">
        <button className="inline-flex items-center space-x-2 border border-gray-300 rounded px-3 py-1 text-gray-700 hover:bg-gray-100 transition">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>
        <button className="inline-flex items-center space-x-2 bg-blue-600 text-white rounded px-3 py-1 hover:bg-blue-700 transition">
          <FilePlus className="w-4 h-4" />
          <span>New Deal</span>
        </button>
      </div>
    </header>
  );
}
src/components/layout/Sidebar.tsx
tsx
Copy code
"use client";

import { Building, Users, BarChart, Calendar, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto hidden md:block">
      <nav className="p-6 space-y-4">
        <div>
          <a href="/properties" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
            <Building className="w-5 h-5" />
            <span>Properties</span>
          </a>
        </div>
        <div>
          <a href="/contacts" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
            <Users className="w-5 h-5" />
            <span>Contacts</span>
          </a>
        </div>
        <div>
          <a href="/deals" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
            <BarChart className="w-5 h-5" />
            <span>Deals</span>
          </a>
        </div>
        <div>
          <a href="/analytics" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
            <BarChart className="w-5 h-5" />
            <span>Analytics</span>
          </a>
        </div>
        <div>
          <a href="/calendar" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
            <Calendar className="w-5 h-5" />
            <span>Calendar</span>
          </a>
        </div>
        <div>
          <a href="/settings" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </a>
        </div>
      </nav>
    </aside>
  );
}
src/components/features/MetricsCards.tsx
tsx
Copy code
"use client";

import { BarChart2, Users, DollarSign, MapPin } from "lucide-react";

export default function MetricsCards() {
  const metrics = [
    { label: "Active Deals", value: 24, icon: BarChart2, bg: "bg-blue-100", text: "text-blue-700" },
    { label: "Total Properties", value: 86, icon: MapPin, bg: "bg-green-100", text: "text-green-700" },
    { label: "Contacts", value: 195, icon: Users, bg: "bg-yellow-100", text: "text-yellow-700" },
    { label: "Pipeline Value", value: "$2.4M", icon: DollarSign, bg: "bg-purple-100", text: "text-purple-700" },
  ];

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, idx) => (
        <div key={idx} className="flex items-center p-4 bg-white border border-gray-200 rounded shadow-sm">
          <div className={`p-2 rounded mr-4 ${metric.bg}`}>
            <metric.icon className={`w-6 h-6 ${metric.text}`} />
          </div>
          <div>
            <div className="text-xl font-semibold">{metric.value}</div>
            <div className="text-gray-600 text-sm">{metric.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
src/components/features/PropertyMap.tsx
tsx
Copy code
"use client";

import Image from "next/image";

export default function PropertyMap() {
  return (
    <div className="border border-gray-200 bg-white rounded shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Property Locations</h3>
      </div>
      <div className="p-4">
        <Image
          src="https://picsum.photos/800/400"
          alt="Map"
          width={800}
          height={400}
          className="w-full h-auto rounded"
        />
      </div>
    </div>
  );
}
src/components/features/TasksList.tsx
tsx
Copy code
"use client";

import { Calendar, CheckCircle, Clock } from "lucide-react";

const tasks = [
  { title: "Call with landlord", due: "Today 4pm", icon: Calendar, done: false },
  { title: "Prepare lease proposal", due: "Tomorrow", icon: Clock, done: false },
  { title: "Finalize deal docs", due: "Friday", icon: CheckCircle, done: true },
];

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
  );
}
src/styles/globals.css
css
Copy code
@tailwind base;
@tailwind components;
@tailwind utilities;
Make sure Tailwind CSS and postcss.config.js, tailwind.config.js are configured as per standard Next.js + Tailwind setup. For example, tailwind.config.js might look like:

js
Copy code
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
