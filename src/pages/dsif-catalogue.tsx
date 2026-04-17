import { ReactElement } from 'react'
import Page from '@shared/Page'
import { useRouter } from 'next/router'
import DSIFCatalogue from '../components/DSIFCatalogue'
import content from 'content/pages/dsif-catalogue.json'

export default function DSIFCataloguePage(): ReactElement {
  const router = useRouter()

  return (
    <Page
      title={content.title}
      description={content.description}
      uri={router.route}
    >
      <DSIFCatalogue />
    </Page>
  )
}
