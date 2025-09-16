import Button from '@components/@shared/atoms/Button'
import { useEdp } from '@context/EdpProvider'

export default function EdpDeleteButton({ assetDid }: { assetDid: string }) {
  const { isRequestingDeletion, startEdpDeletion } = useEdp()

  return (
    <Button
      style="primary"
      disabled={isRequestingDeletion}
      type="button"
      onClick={() => {
        startEdpDeletion(assetDid)
      }}
    >
      Delete EDP listing
    </Button>
  )
}
