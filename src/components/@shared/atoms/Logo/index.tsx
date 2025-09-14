import { ReactElement } from 'react'
import LogoAsset from '@images/sense-blue.svg'
import styles from './index.module.css'

export default function Logo(): ReactElement {
  return (
    <div className={styles.logoWrapper}>
      <LogoAsset className={styles.logo} />
    </div>
  )
}
