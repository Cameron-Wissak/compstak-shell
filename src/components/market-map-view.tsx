'use client'

import { useEffect, useRef, useState } from 'react'
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import OSM from 'ol/source/OSM'
import GeoJSON from 'ol/format/GeoJSON'
import { Fill, Stroke, Style } from 'ol/style'
import { fromLonLat } from 'ol/proj'
import 'ol/ol.css'

interface SubmarketLayer {
  id: string
  name: string
  source: string
  visible: boolean
  layer?: VectorLayer<VectorSource>
  color?: string
}

interface CustomLayer extends SubmarketLayer {
  isCustom: boolean
  file?: File
}

const submarketColors: { [key: string]: string } = {
  'nyc': '#FF1493', // Deep pink
  'nj-north': '#4169E1', // Royal Blue
  'philly': '#32CD32', // Lime Green
  'westchester': '#FFD700', // Gold
  'ny-other': '#FF4500', // Orange Red
  'nj-other': '#9370DB', // Medium Purple
  'pa-other': '#20B2AA', // Light Sea Green
  'default': '#088F8F'
}

// Generate a random color for custom layers
const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

export function MarketMapView() {
  const mapRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [map, setMap] = useState<Map | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [layers, setLayers] = useState<(SubmarketLayer | CustomLayer)[]>([
    { id: 'nyc', name: 'New York City', source: '/compstak-submarket-New-York-City.geojson', visible: true, color: submarketColors['nyc'] },
    { id: 'nj-north', name: 'NJ North & Central', source: '/compstak-submarket-New-Jersey-North-and-Central.geojson', visible: false, color: submarketColors['nj-north'] },
    { id: 'philly', name: 'Philadelphia', source: '/compstak-submarket-Philadelphia-Central-PA-DE-So-NJ.geojson', visible: false, color: submarketColors['philly'] },
    { id: 'westchester', name: 'Westchester & CT', source: '/compstak-submarket-Westchester-and-CT.geojson', visible: false, color: submarketColors['westchester'] },
    { id: 'ny-other', name: 'NY Other', source: '/compstak-submarket-New-York-Other.geojson', visible: false, color: submarketColors['ny-other'] },
    { id: 'nj-other', name: 'NJ Other', source: '/compstak-submarket-New-Jersey-Other.geojson', visible: false, color: submarketColors['nj-other'] },
    { id: 'pa-other', name: 'PA Other', source: '/compstak-submarket-Pennsylvania-Other.geojson', visible: false, color: submarketColors['pa-other'] },
  ])

  const handleFileUpload = async (file: File) => {
    try {
      setUploadError(null)
      
      // Validate file type
      if (!file.name.endsWith('.geojson') && !file.name.endsWith('.json')) {
        throw new Error('Please upload a GeoJSON or JSON file')
      }

      // Read file content
      const content = await file.text()
      let geoJsonData: any

      try {
        geoJsonData = JSON.parse(content)
      } catch {
        throw new Error('Invalid JSON format')
      }

      // Validate GeoJSON structure
      if (!geoJsonData.type || !geoJsonData.features) {
        throw new Error('Invalid GeoJSON structure')
      }

      // Create new layer
      const layerId = `custom-${Date.now()}`
      const layerName = file.name.replace(/\.(geojson|json)$/, '')
      const layerColor = getRandomColor()

      const vectorSource = new VectorSource({
        features: new GeoJSON().readFeatures(geoJsonData, {
          featureProjection: 'EPSG:3857'
        })
      })

      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: new Style({
          fill: new Fill({
            color: layerColor + '66'
          }),
          stroke: new Stroke({
            color: '#000000',
            width: 1.5
          })
        }),
        visible: true
      })

      // Add layer to map
      map?.addLayer(vectorLayer)

      // Add to layers state
      const newLayer: CustomLayer = {
        id: layerId,
        name: layerName,
        source: URL.createObjectURL(file),
        visible: true,
        layer: vectorLayer,
        isCustom: true,
        file: file,
        color: layerColor
      }

      setLayers(prev => [...prev, newLayer])

      // Fit view to new layer extent
      const extent = vectorSource.getExtent()
      map?.getView().fit(extent, { padding: [50, 50, 50, 50] })

    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Error uploading file')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      await handleFileUpload(file)
    }
  }

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await handleFileUpload(file)
    }
  }

  useEffect(() => {
    if (!mapRef.current) return

    // Create the map instance
    const initialMap = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM() // OpenStreetMap as base layer
        })
      ],
      view: new View({
        center: fromLonLat([-74.006, 40.7128]), // NYC coordinates
        zoom: 10,
        maxZoom: 19,
        minZoom: 8
      })
    })

    setMap(initialMap)

    // Load GeoJSON layers
    const loadedLayers = layers.map(layerConfig => {
      const vectorSource = new VectorSource({
        url: layerConfig.source,
        format: new GeoJSON()
      })

      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: new Style({
          fill: new Fill({
            color: (layerConfig.color || submarketColors.default) + '66' // Adding transparency
          }),
          stroke: new Stroke({
            color: '#000000',
            width: 1.5
          })
        }),
        visible: layerConfig.visible
      })

      initialMap.addLayer(vectorLayer)
      return { ...layerConfig, layer: vectorLayer }
    })

    setLayers(loadedLayers)

    return () => {
      initialMap.setTarget(undefined)
    }
  }, [])

  const toggleLayer = (layerId: string) => {
    setLayers(prevLayers => {
      return prevLayers.map(layer => {
        if (layer.id === layerId) {
          const newVisibility = !layer.visible
          if (layer.layer) {
            layer.layer.setVisible(newVisibility)
          }
          return { ...layer, visible: newVisibility }
        }
        return layer
      })
    })
  }

  const removeCustomLayer = (layerId: string) => {
    setLayers(prevLayers => {
      const layerToRemove = prevLayers.find(l => l.id === layerId) as CustomLayer
      if (layerToRemove?.layer) {
        map?.removeLayer(layerToRemove.layer)
      }
      if (layerToRemove?.source && layerToRemove.isCustom) {
        URL.revokeObjectURL(layerToRemove.source)
      }
      return prevLayers.filter(l => l.id !== layerId)
    })
  }

  return (
    <div className="h-[calc(100vh-12rem)]">
      <Card className="h-full">
        <div className="h-full p-4">
          <div className="flex h-full space-x-4">
            {/* Sidebar with fixed height and scrolling */}
            <div className="w-64 flex-shrink-0 bg-white rounded-lg shadow-lg flex flex-col h-full">
              {/* Fixed header */}
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Submarket Layers</h3>
              </div>
              
              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {/* Layer toggles */}
                  <div className="space-y-3">
                    {layers.map(layer => (
                      <div key={layer.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={layer.id}
                            checked={layer.visible}
                            onCheckedChange={() => toggleLayer(layer.id)}
                            className="data-[state=checked]:bg-blue-600"
                          />
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ 
                                backgroundColor: layer.color || submarketColors.default,
                                opacity: layer.visible ? 1 : 0.5 
                              }} 
                            />
                            <Label 
                              htmlFor={layer.id}
                              className={`cursor-pointer ${layer.visible ? 'text-blue-600 font-medium' : ''}`}
                            >
                              {layer.name}
                            </Label>
                          </div>
                        </div>
                        {'isCustom' in layer && layer.isCustom && (
                          <button
                            onClick={() => removeCustomLayer(layer.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Upload Section */}
                  <div className="border-t pt-4 mt-2">
                    <h4 className="text-sm font-semibold mb-2">Custom Data</h4>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".geojson,.json"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    <div
                      className={`border-2 border-dashed rounded-md p-4 text-center transition-colors ${
                        isDragging
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <p className="text-sm text-gray-600">
                        Drop GeoJSON file here or click to upload
                      </p>
                    </div>
                    {uploadError && (
                      <p className="text-sm text-red-500 mt-2">{uploadError}</p>
                    )}
                  </div>

                  {/* Drawing Tools */}
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold mb-2">Drawing Tools</h4>
                    <div className="space-y-2">
                      <button className="w-full px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                        Draw Polygon
                      </button>
                      <button className="w-full px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                        Draw Circle
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map container */}
            <div className="flex-grow bg-gray-50 rounded-lg overflow-hidden">
              <div ref={mapRef} className="h-full w-full" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
} 