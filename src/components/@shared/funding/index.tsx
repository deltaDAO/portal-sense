import Image from 'next/image'
import content from '../../../../content/funding.json'
import styles from './index.module.css'

export default function Funding() {
  return (
    <div className={styles.container}>
      <Image
        src="/images/EUROPEAN-UNION-FLAG.jpg"
        alt="European Union flag"
        width={172}
        height={115}
      />
      <span>{content.text}</span>
    </div>
  )
}
