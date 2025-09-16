import { ReactElement } from 'react'
import styles from './Footer.module.css'
import Markdown from '@shared/Markdown'
import Links from './Links'
import { useMarketMetadata } from '@context/MarketMetadata'
import DeltaDaoLogo from '@images/sense-blue.svg'
import Container from '@components/@shared/atoms/Container'

export default function Footer(): ReactElement {
  const { siteContent } = useMarketMetadata()
  const { siteTitle, footer } = siteContent
  const { copyright, subtitle } = footer

  return (
    <footer className={styles.footer}>
      <Container className={styles.container}>
        <div>
          <a
            href="https://delta-dao.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles.main}>
              <DeltaDaoLogo />
            </div>
          </a>
        </div>
        <Links />
      </Container>
      <div className={styles.copyright}>
        <Markdown text={copyright} />
      </div>
    </footer>
  )
}
