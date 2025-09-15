import { ReactElement, useEffect, useState } from 'react'
import styles from './EdpInfo.module.css'
import Button from '@components/@shared/atoms/Button'
import { useAsset } from '@context/Asset'
import content from '../../../../content/edpInfo.json'
import Markdown from '@components/@shared/Markdown'
import VerifiedPatch from '@images/patch_check.svg'
import logo from '@images/beebucket-logo-small.png'
import Image from 'next/image'
import { useEdp } from '@context/EdpProvider'
import { Asset } from '@oceanprotocol/lib'

export default function EdpInfo({ asset }: { asset: Asset }): ReactElement {
  const { getEdpLink } = useEdp()
  const [isRegisteredEdp, setIsRegisteredEdp] = useState<string>()
  const { isOwner } = useAsset()

  useEffect(() => {
    const getEdpInfo = async () => {
      try {
        const edpLink = await getEdpLink(asset?.id)
        if (edpLink) {
          setIsRegisteredEdp(edpLink)
        }
      } catch (error) {
        setIsRegisteredEdp(undefined)
      }
    }
    getEdpInfo()
  }, [])

  return (
    <>
      {isOwner && !isRegisteredEdp ? (
        <div className={styles.edpBox}>
          <div>
            <h4>{content.title}</h4>
            <Markdown text={content.edpIsNotRegistered} />
            <div className={`${styles.ownerActions} ${styles.edpEditButton}`}>
              <Button style="text" size="small" to={`/asset/${asset?.id}/edit`}>
                Edit Asset
              </Button>
            </div>
          </div>
        </div>
      ) : (
        isRegisteredEdp && (
          <>
            <div className={styles.edpBox}>
              <div>
                <h4>{content.title}</h4>
                <div className={styles.edpDescriptionAndLogoBox}>
                  <div className={styles.edpDescription}>
                    <Markdown text={content.edpIsRegistered} />{' '}
                    <VerifiedPatch />
                  </div>
                  <div className={styles.logoContainer}>
                    <Image
                      src={logo.src}
                      alt="Beebucket"
                      className={styles.logo}
                      width={70}
                      height={70}
                    />
                  </div>
                </div>
                <Button href={isRegisteredEdp} style="primary">
                  {content.exploreEdpButton}
                </Button>
              </div>
            </div>
          </>
        )
      )}
    </>
  )
}
