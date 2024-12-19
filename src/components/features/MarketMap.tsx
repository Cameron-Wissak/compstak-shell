'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import L from 'leaflet'
import LeasePopup from './LeasePopup'
import { ParsedComparable } from '@/utils/parseComparables'

// Dynamically import Leaflet components with no SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

// Configure marker icons
const createIcon = (color: string) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const officeIcon = createIcon('blue')
const retailIcon = createIcon('green')

interface MarketMapProps {
  comparables: ParsedComparable[]
  selectedType?: string
  dateRange?: { start: Date; end: Date }
  onLeaseSelect?: (lease: ParsedComparable) => void
  starredLeases?: Set<string>
  onStarLease?: (lease: ParsedComparable) => void
}

export default function MarketMap({ 
  comparables, 
  selectedType, 
  dateRange, 
  onLeaseSelect,
  starredLeases = new Set(),
  onStarLease 
}: MarketMapProps) {
  const [isClient, setIsClient] = useState(false)
  const [filteredComparables, setFilteredComparables] = useState<ParsedComparable[]>([])
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.74204, -73.99383]) // Centered on NYC

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Filter comparables based on props and update map center
  useEffect(() => {
    console.log('Total comparables received:', comparables.length)
    
    let filtered = [...comparables]
    
    if (selectedType) {
      filtered = filtered.filter(comp => comp.spaceType === selectedType)
    }
    
    if (dateRange?.start && dateRange?.end) {
      filtered = filtered.filter(comp => {
        const dealDate = new Date(comp.executionDate)
        return dealDate >= dateRange.start && dealDate <= dateRange.end
      })
    }

    // Calculate map center based on filtered comparables
    if (filtered.length > 0) {
      const sumLat = filtered.reduce((sum, comp) => sum + comp.coordinates[0], 0)
      const sumLng = filtered.reduce((sum, comp) => sum + comp.coordinates[1], 0)
      setMapCenter([sumLat / filtered.length, sumLng / filtered.length])
    }
    
    console.log('Filtered comparables:', filtered.length)
    setFilteredComparables(filtered)
  }, [comparables, selectedType, dateRange])

  // Group leases by address
  const leasesByAddress = useMemo(() => {
    return filteredComparables.reduce((acc, comp) => {
      const key = `${comp.address}-${comp.coordinates[0]}-${comp.coordinates[1]}`
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(comp)
      return acc
    }, {} as Record<string, ParsedComparable[]>)
  }, [filteredComparables])

  const getMarkerIcon = (leases: ParsedComparable[]) => {
    // If any lease in the group is retail, show retail icon
    return leases.some(lease => lease.spaceType.toLowerCase().includes('retail')) ? retailIcon : officeIcon
  }

  // Memoize the map component to prevent re-renders
  const MapComponent = useMemo(() => (
    <MapContainer
      key="map"
      center={mapCenter}
      zoom={15}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {Object.entries(leasesByAddress).map(([key, leases]) => {
        const [lat, lng] = leases[0].coordinates
        return (
          <Marker
            key={key}
            position={[lat, lng]}
            icon={getMarkerIcon(leases)}
            eventHandlers={{
              click: () => {
                // If there's only one lease, use the onLeaseSelect callback
                if (leases.length === 1 && onLeaseSelect) {
                  onLeaseSelect(leases[0])
                }
              }
            }}
          >
            <Popup>
              <LeasePopup 
                leases={leases} 
                onStarLease={onStarLease}
                starredLeases={starredLeases}
              />
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  ), [mapCenter, leasesByAddress, onLeaseSelect, onStarLease, starredLeases])

  // Don't render the map on the server
  if (!isClient) return <div>Loading map...</div>

  return (
    <div className="h-[600px] relative">
      <div className="absolute top-4 right-4 z-10 bg-white p-4 rounded-lg shadow-lg">
        <h3 className="font-medium mb-2">Legend</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2" />
            <span>Office Leases ({filteredComparables.filter(c => !c.spaceType.toLowerCase().includes('retail')).length})</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2" />
            <span>Retail Leases ({filteredComparables.filter(c => c.spaceType.toLowerCase().includes('retail')).length})</span>
          </div>
        </div>
      </div>

      {MapComponent}
    </div>
  )
} 