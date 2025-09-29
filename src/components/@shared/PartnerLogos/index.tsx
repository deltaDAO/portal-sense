import { ReactElement } from 'react'
import styles from './index.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)
const partnerLogos = require
  .context('../../../../public/images/partners', false, /\.(png|jpe?g)$/)
  .keys()
  .filter((e) => e.startsWith('./'))
  .map((x) => x.replace('./', ''))

export default function PartnerLogos({
  className
}: {
  className?: string
}): ReactElement {
  return (
    <>
      <h2 className={styles.title}>Partners</h2>
      <div
        className={cx({
          container: true,
          [className]: className
        })}
      >
        {partnerLogos.map((logo) => (
          <img
            key={logo}
            className={styles.logo}
            src={`/images/partners/${logo}`}
            alt={`Partner Logo ${logo}`}
          />
        ))}
      </div>
    </>
  )
}
