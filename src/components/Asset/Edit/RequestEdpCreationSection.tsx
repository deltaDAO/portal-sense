import { useAsset } from '@context/Asset'
import { useFormikContext } from 'formik'
import { useEffect, useState } from 'react'
import content from '../../../../content/pages/editMetadata.json'
import Button from '@components/@shared/atoms/Button'
import Markdown from '@components/@shared/Markdown'
import styles from './FormEditMetadata.module.css'
import { useEdp } from '@context/EdpProvider'
import { toast } from 'react-toastify'
import { MetadataEditForm } from './_types'
import EdpDeleteButton from './EdpDeleteButton'

export default function RequestEdpCreationSection({
  makeAssetEdpsReady
}: {
  makeAssetEdpsReady: (values: Partial<MetadataEditForm>) => void
}) {
  const {
    edpsComputationAddress,
    createEdp,
    checkEdpsAccessRights,
    getEdpsAlgoDid,
    getEdpLink
  } = useEdp()
  const [showHint, setShowHint] = useState(false)
  const { asset } = useAsset()
  const { values } = useFormikContext()
  const [isEdpsCreationButtonDisabled, setIsEdpsCreationButtonDisabled] =
    useState(false)
  const [isRegisteredEdp, setIsRegisteredEdp] = useState<boolean>()

  useEffect(() => {
    if (!checkEdpsAccessRights(asset)) {
      setShowHint(true)
      setIsEdpsCreationButtonDisabled(true)
    } else {
      setShowHint(false)
      setIsEdpsCreationButtonDisabled(false)
    }

    const getEdpInfo = async () => {
      try {
        const edpLink = await getEdpLink(asset?.id)
        if (edpLink) {
          setIsRegisteredEdp(true)
        }
      } catch (error) {
        setIsRegisteredEdp(false)
      }
    }
    getEdpInfo()
  }, [])

  const insertDidAndAddressInHint = () => {
    const did = getEdpsAlgoDid(asset.chainId)
    let hintText = content.form.edpHint.replace('[EdpsAlgoDid]', did)
    hintText = hintText.replace('[EdpsAlgoAddress]', edpsComputationAddress)
    return hintText
  }

  const startEdpCreation = async () => {
    setIsEdpsCreationButtonDisabled(true)
    try {
      await createEdp(asset)
      toast.success('EDP creation request sent')
    } catch (error) {
      toast.error(`Error sending EDP creation request ${error}`)
      setIsEdpsCreationButtonDisabled(false)
    }
  }

  return (
    <div className={styles.edpContainer}>
      <h4>beebucket EDP</h4>
      <span>{content.form.edpDescription}</span>
      {showHint && (
        <div className={styles.hint}>
          <Markdown text={insertDidAndAddressInHint()} />
        </div>
      )}
      {!showHint ? (
        <div className={styles.buttonContainer}>
          <Button
            type="button"
            style="primary"
            onClick={startEdpCreation}
            disabled={isEdpsCreationButtonDisabled}
          >
            {content.form.edpRegisterButton}
          </Button>
          {isRegisteredEdp && <EdpDeleteButton assetDid={asset.id} />}
        </div>
      ) : (
        <Button
          type="button"
          style="primary"
          onClick={() => makeAssetEdpsReady(values)}
        >
          {content.form.edpsAccessButton}
        </Button>
      )}
    </div>
  )
}
