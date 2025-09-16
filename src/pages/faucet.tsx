import { ReactElement, useEffect } from 'react'
import Faucet from '../components/Faucet'
import content from '../../content/pages/faucet.json'
import Page from '@components/@shared/Page'
import { useMarketMetadata } from '@context/MarketMetadata'
import { useRouter } from 'next/router'

export default function PageFaucet(): ReactElement {
  const {
    appConfig: { faucet }
  } = useMarketMetadata()
  const router = useRouter()
  useEffect(() => {
    if (faucet.enabled !== 'true') {
      router.replace('/404')
    }
  }, [faucet.enabled, router])

  if (faucet.enabled !== 'true') return null

  return (
    <Page title={content.title} description={content.description} uri="">
      <Faucet />
    </Page>
  )
}
