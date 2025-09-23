import { ReactElement } from 'react'
import styles from './index.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export default function Partners({
  className
}: {
  className?: string
}): ReactElement {
  const partners = require
    .context('../../../../public/images/partners', false, /\.(png|jpe?g)$/)
    .keys()
    .filter((e) => e.startsWith('./'))
    .map((x) => x.replace('./', ''))

  return (
    <>
      <h2 className={styles.title}>Partners</h2>
      <div
        className={cx({
          container: true,
          [className]: className
        })}
      >
        {partners?.map((logo) => (
          <img
            key={logo}
            className={styles.logo}
            src={`/images/partners/${logo}`}
          />
        ))}
      </div>
    </>
  )
}
