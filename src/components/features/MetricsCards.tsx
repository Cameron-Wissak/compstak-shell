"use client";

import { BarChart2, Users, DollarSign, MapPin } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function MetricsCards() {
  const router = useRouter();

  const metrics = [
    { label: "Active Deals", value: 24, icon: BarChart2, bg: "bg-blue-100", text: "text-blue-700", href: "/deals" },
    { label: "Total Properties", value: 86, icon: MapPin, bg: "bg-green-100", text: "text-green-700", href: "/properties" },
    { label: "Contacts", value: 195, icon: Users, bg: "bg-yellow-100", text: "text-yellow-700", href: "/contacts" },
    { label: "Pipeline Value", value: "$2.4M", icon: DollarSign, bg: "bg-purple-100", text: "text-purple-700", href: "/deals" },
  ];

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, idx) => (
        <div
          key={idx}
          onClick={() => router.push(metric.href)}
          className="flex items-center p-4 bg-white border border-gray-200 rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
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