interface RawCompStakDeal {
  'Street Address': string
  'Market': string
  'City': string
  'Space Type': string
  'Execution Date': string
  'Comments': string
  'Transaction SQFT': string
  'Tenant Name': string
  'Transaction Quarter': string
  'Tenant Ownership': string
  'Transaction Type': string
  'Starting Rent (USD) (per year)': string
  'Rent Schedule (USD)': string
  'Rent Bump Dollar (USD)': string
  'Rent Bump Percent': string
  'Free Rent': string
  'Work Value (USD)': string
  'Effective Rent (USD) (per year)': string
  'Floors Occupied': string
  'Lease Term': string
  'Expiration Date': string
  'Geo Point': string
}

export interface ParsedComparable {
  address: string
  market: string
  city: string
  spaceType: string
  executionDate: string
  comments: string
  transactionSqft: number
  tenantName: string
  transactionQuarter: string
  tenantOwnership: string
  transactionType: string
  startingRent: number
  rentSchedule: string
  rentBumpDollar: string
  rentBumpPercent: string
  freeRent: string
  workValue: string
  effectiveRent: string
  floorsOccupied: string
  leaseTerm: string
  expirationDate: string
  coordinates: [number, number]
}

export function parseCompStakData(rawData: string): ParsedComparable[] {
  try {
    // Split the CSV into lines, handling potential quoted values
    const lines = rawData.split('\n').map(line => line.trim()).filter(line => line)
    const headers = lines[0].split(',')

    // Process each line after the header
    const deals = lines.slice(1).map(line => {
      // Match either quoted fields or non-quoted fields
      const matches = line.match(/("([^"]*)"|[^,]*),?/g)
      if (!matches) return null

      const values = matches.map(value => 
        value.replace(/^"|"$|,$/, '').trim() // Remove quotes and trailing commas
      )

      const deal: any = {}
      headers.forEach((header, index) => {
        deal[header.trim()] = values[index] || ''
      })
      return deal
    }).filter(deal => deal !== null) as RawCompStakDeal[]

    console.log(`Found ${deals.length} raw deals`)

    return deals.map((deal: RawCompStakDeal) => {
      // Extract coordinates from Geo Point string
      const coordsMatch = deal['Geo Point']?.match(/\(([-\d.]+),\s*([-\d.]+)\)/)
      const coordinates: [number, number] = coordsMatch 
        ? [parseFloat(coordsMatch[1]), parseFloat(coordsMatch[2])]
        : [0, 0]

      // Parse rent value, handling empty or invalid values
      const rentStr = deal['Starting Rent (USD) (per year)']?.replace(/[^0-9.]/g, '')
      const rentValue = rentStr ? parseFloat(rentStr) : 0

      // Parse transaction sqft, handling empty or invalid values
      const sqftStr = deal['Transaction SQFT']?.replace(/[^0-9.]/g, '')
      const sqft = sqftStr ? parseInt(sqftStr, 10) : 0

      // Parse work value
      const workValueStr = deal['Work Value (USD)']?.replace(/[^0-9.]/g, '')
      const workValue = workValueStr || undefined

      // Parse effective rent
      const effectiveRentStr = deal['Effective Rent (USD) (per year)']?.replace(/[^0-9.]/g, '')
      const effectiveRent = effectiveRentStr || undefined

      return {
        address: deal['Street Address'] || '',
        market: deal['Market'] || '',
        city: deal['City'] || '',
        spaceType: deal['Space Type'] || '',
        executionDate: deal['Execution Date'] || '',
        comments: deal['Comments'] || '',
        transactionSqft: sqft,
        tenantName: deal['Tenant Name'] || 'Undisclosed',
        transactionQuarter: deal['Transaction Quarter'] || '',
        tenantOwnership: deal['Tenant Ownership'] || '',
        transactionType: deal['Transaction Type'] || '',
        startingRent: rentValue,
        rentSchedule: deal['Rent Schedule (USD)'] || '',
        rentBumpDollar: deal['Rent Bump Dollar (USD)'] || '',
        rentBumpPercent: deal['Rent Bump Percent'] || '',
        freeRent: deal['Free Rent'] || '',
        workValue: workValue || '0',
        effectiveRent: effectiveRent || '0',
        floorsOccupied: deal['Floors Occupied'] || '',
        leaseTerm: deal['Lease Term'] || '',
        expirationDate: deal['Expiration Date'] || '',
        coordinates
      }
    })
    // Only filter out entries with invalid coordinates
    .filter(deal => 
      deal.coordinates[0] !== 0 && 
      deal.coordinates[1] !== 0
    )
  } catch (error) {
    console.error('Error parsing CompStak data:', error)
    return []
  }
} 