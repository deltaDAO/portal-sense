export interface VisionsTrustProvider {
  _id: string
  name: string
  legalName?: string
}

export interface VisionsTrustServiceOffering {
  _id: string
  name: string
  description: string
  providedBy: string
  archived: boolean
  visible: boolean
  pricing?: number
  currency?: string
}

export interface ResolvedServiceOffering {
  _id: string
  name: string
  description: string
  provider: VisionsTrustProvider
  link: string
  pricing?: number
  currency?: string
}
