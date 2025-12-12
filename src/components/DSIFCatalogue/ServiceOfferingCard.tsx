import { ReactElement } from 'react'
import Dotdotdot from 'react-dotdotdot'
import { ResolvedServiceOffering } from 'src/@types/VisionsTrust'
import Publisher from '@shared/Publisher'
import Price from '@shared/Price'
import styles from '@shared/AssetTeaser/index.module.css'

interface ServiceOfferingCardProps {
  offering: ResolvedServiceOffering
}

export default function ServiceOfferingCard({
  offering
}: ServiceOfferingCardProps): ReactElement {
  const PROMETHEUS_X_NETWORK = 'Prometheus-X'
  const hasPrice = offering.pricing !== undefined && offering.pricing !== null

  return (
    <article className={`${styles.teaser} ${styles.dataset}`}>
      <a
        href={offering.link}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
      >
        <header className={styles.header}>
          <Dotdotdot tagName="h1" clamp={3} className={styles.title}>
            {offering.name.slice(0, 200)}
          </Dotdotdot>
          <Publisher
            account=""
            minimal
            showName
            verifiedServiceProviderName={offering.provider.legalName}
          />
        </header>
        <div className={styles.content}>
          <Dotdotdot tagName="p" clamp={3}>
            {offering.description}
          </Dotdotdot>
        </div>
        <div className={styles.price}>
          {hasPrice ? (
            <Price
              price={{
                value: offering.pricing,
                tokenSymbol: offering.currency || 'EUR'
              }}
              size="small"
            />
          ) : (
            <strong>No pricing schema available</strong>
          )}
        </div>
        <footer className={styles.footer}>
          <div className={styles.stats}></div>
          <span className={styles.networkName}>{PROMETHEUS_X_NETWORK}</span>
        </footer>
      </a>
    </article>
  )
}
