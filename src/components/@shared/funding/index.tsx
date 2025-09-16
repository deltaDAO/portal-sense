import Image from 'next/image'
import content from '../../../../content/funding.json'
import styles from './index.module.css'
import EuFlag from '../../../@images/Flag_of_Europe.svg'

export default function Funding() {
  return (
    <div className={styles.container}>
      <EuFlag width={172} height={115} alt="EU Flag" />
      <span>{content.text}</span>
    </div>
  )
}
