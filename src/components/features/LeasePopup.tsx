import { useState } from 'react';
import { ParsedComparable } from '@/utils/parseComparables';
import { Star } from 'lucide-react';

interface LeasePopupProps {
  leases: ParsedComparable[];
  onStarLease?: (lease: ParsedComparable) => void;
  starredLeases?: Set<string>;
}

export default function LeasePopup({ leases, onStarLease, starredLeases = new Set() }: LeasePopupProps) {
  const [activeTab, setActiveTab] = useState(0);
  
  // Calculate averages
  const averages = {
    rent: leases.reduce((sum, lease) => sum + (lease.startingRent || 0), 0) / leases.length,
    size: leases.reduce((sum, lease) => sum + (lease.transactionSqft || 0), 0) / leases.length,
  };

  const getLeaseId = (lease: ParsedComparable) => {
    return `${lease.address}-${lease.tenantName}-${lease.executionDate}`;
  };

  return (
    <div className="min-w-[400px] bg-white">
      {/* Header */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h2 className="text-2xl font-normal">{leases[0].address}</h2>
          {onStarLease && (
            <button
              onClick={() => onStarLease(leases[activeTab])}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Star 
                className={`w-5 h-5 ${
                  starredLeases.has(getLeaseId(leases[activeTab]))
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-400'
                }`}
              />
            </button>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-4">{leases.length} leases</p>

        {/* Averages */}
        <div className="grid grid-cols-2 gap-x-12">
          <div>
            <p className="text-gray-600 text-sm">Average Rent</p>
            <p className="text-2xl font-normal">${Math.round(averages.rent)}/SF</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Average Size</p>
            <p className="text-2xl font-normal">{Math.round(averages.size).toLocaleString()} SF</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-200">
        <div className="flex">
          {leases.map((lease, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 text-sm font-normal border-b-2 whitespace-nowrap ${
                activeTab === index
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-1">
                <span>{lease.tenantName || `Lease ${index + 1}`}</span>
                {starredLeases.has(getLeaseId(lease)) && (
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lease Details */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-x-12 gap-y-4">
          <div>
            <p className="text-gray-600 text-sm">Space Type</p>
            <p className="text-lg font-normal">{leases[activeTab].spaceType}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Size</p>
            <p className="text-lg font-normal">{leases[activeTab].transactionSqft?.toLocaleString()} SF</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Date</p>
            <p className="text-lg font-normal">
              {new Date(leases[activeTab].executionDate).toLocaleDateString('en-US', {
                month: 'numeric',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Term</p>
            <p className="text-lg font-normal">{leases[activeTab].leaseTerm || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 