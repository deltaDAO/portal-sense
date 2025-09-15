import { createTrustedAlgorithmList } from '@utils/compute'
import {
  createContext,
  useContext,
  ReactElement,
  ReactNode,
  useState,
  useEffect
} from 'react'
import { useCancelToken } from '@hooks/useCancelToken'
import { useMarketMetadata } from '@context/MarketMetadata'
import axios from 'axios'
import { useAccount, useSignMessage } from 'wagmi'
import { Asset } from '@oceanprotocol/lib'
import { useAutomation } from './Automation/AutomationProvider'
import { toast } from 'react-toastify'

const DASEEN_PONTUSX_API_PATHS = {
  nonce: '/nonce',
  edp: '/edp'
} as const

const DASEEN_API_PATHS = {
  findResourceId: '/search/find-resource-id'
} as const

interface EdpValue {
  getTrustedAlgorithmListWithEdps: (asset: Asset) => Promise<any>
  createEdp: (asset: Asset) => Promise<any>
  edpsComputationAddress: string
  checkEdpsAccessRights: (asset: Asset) => boolean
  getEdpsAllowAddresses: (asset: Asset) => string[]
  getEdpsAlgoDid: (chainId: number) => string
  isEdpsAlgoMissing: (asset: Asset) => boolean
  getEdpLink: (assetDid: string) => Promise<string>
  startEdpDeletion: (assetId: string) => Promise<void>
  isRequestingDeletion: boolean
}

const EdpContext = createContext({} as EdpValue)

function EdpProvider({ children }: { children: ReactNode }): ReactElement {
  const newCancelToken = useCancelToken()
  const { address: accountId } = useAccount()
  const {
    appConfig: {
      edpConfig: {
        daseenPontusxApiBaseUrl,
        edpsAlgoAssets,
        edpsComputationAddress,
        daseenApiBaseUrl,
        edpBaseUrl
      }
    }
  } = useMarketMetadata()
  const {
    signMessage,
    data: signMessageData,
    isSuccess: isMessageSignSuccess,
    isError: isMessageSignError
  } = useSignMessage()
  const { autoWallet, isAutomationEnabled } = useAutomation()
  const [activeAddress, setActiveAddress] = useState<string>()
  const [signature, setSignature] = useState<string>()
  const [isRequestingDeletion, setIsRequestingDeletion] = useState(false)
  const [assetId, setAssetId] = useState<string>()
  const [deletionMessage, setDeletionMessage] = useState<string>()

  const getNonce: () => Promise<string> = async () => {
    try {
      const response = await axios.post(
        `${daseenPontusxApiBaseUrl}${DASEEN_PONTUSX_API_PATHS.nonce}`,
        {
          address: activeAddress
        }
      )
      return response.data.nonce
    } catch (error) {
      console.error('Error fetching nonce:', error)
      throw error
    }
  }

  const getDeletionMessageToSign = async (assetId: string) => {
    const nonce = await getNonce()
    const message = `Delete EDP with assetId ${assetId}. Nonce: ${nonce}`
    return message
  }

  const requestEdpDeletions = async () => {
    try {
      await axios.delete(
        `${daseenPontusxApiBaseUrl}${DASEEN_PONTUSX_API_PATHS.edp}`,
        {
          data: {
            did: assetId,
            message: deletionMessage,
            signature
          }
        }
      )
    } catch (error) {
      console.error(`Error deleting EDP: ${error}`)
      toast.error(`Error deleting EDP: ${error}`)
      setIsRequestingDeletion(false)
    }
  }

  const checkEdpsAccessRights = (asset: Asset) => {
    const isEdpsAlgoInPublisherTrustedAlgorithms =
      asset.services[0]?.compute?.publisherTrustedAlgorithms?.some(
        (algorithm) =>
          algorithm.did ===
          edpsAlgoAssets[asset.chainId.toString()].toLowerCase()
      )
    const isEdpAdressAllowed = asset.credentials?.allow[0]?.values.some(
      (address) => address === edpsComputationAddress.toLowerCase()
    )
    return isEdpAdressAllowed && isEdpsAlgoInPublisherTrustedAlgorithms
  }

  const getEdpsAlgoDid = (chainId: number): string => {
    return edpsAlgoAssets[chainId.toString()]
  }

  const getTrustedAlgorithmListWithEdps = async (asset: Asset) => {
    const edpsAlgoDid = getEdpsAlgoDid(asset.chainId)
    const newTrustedAlgorithms = await createTrustedAlgorithmList(
      [edpsAlgoDid],
      asset.chainId,
      newCancelToken()
    )
    return newTrustedAlgorithms
  }

  const createEdp = async (asset: Asset) => {
    await axios.post(
      `${daseenPontusxApiBaseUrl}${DASEEN_PONTUSX_API_PATHS.edp}`,
      {
        did: asset.id,
        serviceId: asset.services[0].id
      }
    )
  }

  const getEdpsAllowAddresses = (asset: Asset): string[] => {
    const allowAddresses =
      asset.credentials?.allow?.find(
        (credential) => credential.type === 'address'
      )?.values || []
    const isAddressAlreadyInAllowList = allowAddresses?.some(
      (address) => address === edpsComputationAddress.toLowerCase()
    )
    const isUserAddressAlreadyInAllowList = allowAddresses?.some(
      (address) => address === accountId.toLowerCase()
    )
    if (
      !isUserAddressAlreadyInAllowList &&
      accountId.toLowerCase() !== edpsComputationAddress.toLowerCase()
    ) {
      allowAddresses.push(accountId.toLowerCase())
    }
    if (!isAddressAlreadyInAllowList) {
      allowAddresses.push(edpsComputationAddress.toLowerCase())
    }
    return allowAddresses
  }

  const isEdpsAlgoMissing = (asset: Asset): boolean => {
    const isEdpsAlgoInPublisherTrustedAlgorithms =
      asset.services[0]?.compute?.publisherTrustedAlgorithms?.some(
        (algorithm) =>
          algorithm.did ===
          edpsAlgoAssets[asset.chainId.toString()].toLowerCase()
      )
    if (!isEdpsAlgoInPublisherTrustedAlgorithms) {
      return true
    }
    return false
  }

  const getEdpIdFromResponseData = (data: string[] | string): string | null => {
    let edpId: string
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return null
      }
      edpId = data.at(-1)
    } else {
      edpId = data
    }
    if (typeof edpId !== 'string') {
      return null
    }
    if (edpId.trim().length > 0) {
      return edpId
    }
    return null
  }

  const getEdpLink = async (assetDid: string): Promise<string | null> => {
    try {
      const response = await axios.post(
        `${daseenApiBaseUrl}${DASEEN_API_PATHS.findResourceId}`,
        {
          assetId: assetDid,
          dataSpaceName: 'Pontus-X'
        }
      )
      if (response.status !== 200) {
        throw new Error('Failed to fetch resource ID')
      }
      const edpId = getEdpIdFromResponseData(response.data)
      if (!edpId) {
        return null
      }
      return `${edpBaseUrl}/${edpId}`
    } catch (error) {
      console.error('Error fetching EDP link:', error)
    }
  }

  const signDeletionMessage = async (message: string) => {
    if (isAutomationEnabled) {
      try {
        const autoWalletSignature = await autoWallet.signMessage(message)
        setSignature(autoWalletSignature)
      } catch (error) {
        setIsRequestingDeletion(false)
        toast.error(`Error signing message for EDP deletion: ${error.message}`)
        console.error(error)
      }
    } else {
      signMessage({ message })
    }
  }

  const startEdpDeletion = async (assetId: string) => {
    setIsRequestingDeletion(true)
    const message = await getDeletionMessageToSign(assetId)
    setDeletionMessage(message)
    await signDeletionMessage(message)
    setAssetId(assetId)
  }

  useEffect(() => {
    if (isAutomationEnabled) setActiveAddress(autoWallet.address)
    else setActiveAddress(accountId)
  }, [accountId, autoWallet?.address, isAutomationEnabled])

  useEffect(() => {
    if (isMessageSignError) setIsRequestingDeletion(false)
    if (isMessageSignSuccess) {
      setSignature(signMessageData)
    }
  }, [isMessageSignSuccess, isMessageSignError])

  useEffect(() => {
    if (!signature) return
    requestEdpDeletions()
  }, [signature])

  return (
    <EdpContext.Provider
      value={
        {
          getTrustedAlgorithmListWithEdps,
          createEdp,
          edpsComputationAddress,
          checkEdpsAccessRights,
          getEdpsAllowAddresses,
          getEdpsAlgoDid,
          isEdpsAlgoMissing,
          getEdpLink,
          startEdpDeletion,
          isRequestingDeletion
        } as EdpValue
      }
    >
      {children}
    </EdpContext.Provider>
  )
}

const useEdp = (): EdpValue => useContext(EdpContext)

export { EdpProvider, useEdp }
