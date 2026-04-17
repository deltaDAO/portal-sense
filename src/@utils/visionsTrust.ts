import {
  VisionsTrustProvider,
  VisionsTrustServiceOffering,
  ResolvedServiceOffering
} from 'src/@types/VisionsTrust'

const VISIONS_TRUST_API_BASE = 'https://api.visionstrust.com/v1'

export interface FetchServiceOfferingsParams {
  page?: number
  limit?: number
  search?: string
}

export interface ServiceOfferingsResponse {
  result: VisionsTrustServiceOffering[]
  count: number
  page: number
  pages: number | null
}

/**
 * Fetch service offerings from Visions Trust API with pagination
 */
export async function fetchServiceOfferings(
  params: FetchServiceOfferingsParams = {}
): Promise<ServiceOfferingsResponse> {
  const { page = 1, limit = 50, search = '' } = params

  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search
    })

    const response = await fetch(
      `${VISIONS_TRUST_API_BASE}/serviceofferings?${queryParams}`,
      { headers: { 'Content-Type': 'application/json' } }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch service offerings: ${response.status}`)
    }

    const responseData = await response.json()
    // API returns data in response.data with pagination info
    return {
      result: responseData?.data?.result || [],
      count: responseData?.data?.count || 0,
      page: responseData?.data?.page || 0,
      pages: responseData?.data?.pages
    }
  } catch (error) {
    console.error('Error fetching service offerings:', error)
    return { result: [], count: 0, page: 0, pages: null }
  }
}

/**
 * Fetch a single provider by ID from Visions Trust API
 */
export async function fetchProvider(
  providerId: string
): Promise<VisionsTrustProvider | null> {
  try {
    const response = await fetch(
      `${VISIONS_TRUST_API_BASE}/catalog/participants/${providerId}`,
      { headers: { 'Content-Type': 'application/json' } }
    )

    if (!response.ok) {
      throw new Error(
        `Failed to fetch provider ${providerId}: ${response.status}`
      )
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching provider ${providerId}:`, error)
    return null
  }
}

/**
 * Filter service offerings based on criteria
 */
export function filterServiceOfferings(
  offerings: VisionsTrustServiceOffering[]
): VisionsTrustServiceOffering[] {
  return offerings.filter(
    (offering) => offering.archived === false && offering.visible === true
  )
}

/**
 * Resolve service offerings with provider details
 */
export async function resolveServiceOfferings(
  offerings: VisionsTrustServiceOffering[]
): Promise<ResolvedServiceOffering[]> {
  const providerCache = new Map<string, VisionsTrustProvider>()

  const resolved = await Promise.all(
    offerings.map(async (offering) => {
      let provider = providerCache.get(offering.providedBy)

      if (!provider) {
        provider = await fetchProvider(offering.providedBy)
        if (provider) {
          providerCache.set(offering.providedBy, provider)
        }
      }

      return {
        _id: offering._id,
        name: offering.name,
        description: offering.description,
        provider: provider || {
          _id: offering.providedBy,
          name: 'Unknown Provider'
        },
        link: `https://visionstrust.com/catalog/offers/${offering._id}`,
        pricing: offering.pricing,
        currency: offering.currency
      }
    })
  )

  return resolved
}

/**
 * Fetch and resolve filtered service offerings for a specific page
 */
export async function fetchDSIFCatalogueData(
  params: FetchServiceOfferingsParams = {}
): Promise<{
  offerings: ResolvedServiceOffering[]
  totalCount: number
  totalPages: number
}> {
  const response = await fetchServiceOfferings(params)
  const filteredOfferings = filterServiceOfferings(response.result)
  const resolvedOfferings = await resolveServiceOfferings(filteredOfferings)

  return {
    offerings: resolvedOfferings,
    totalCount: response.count,
    totalPages: Math.ceil(response.count / (params.limit || 50))
  }
}
