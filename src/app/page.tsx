'use client'

import MetricsCards from "../components/features/MetricsCards";
import PropertyMap from "../components/features/PropertyMap";
import TasksList from "../components/features/TasksList";

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