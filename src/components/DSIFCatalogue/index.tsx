import { ReactElement, useEffect, useState, useCallback } from 'react'
import { ResolvedServiceOffering } from 'src/@types/VisionsTrust'
import { fetchDSIFCatalogueData } from '@utils/visionsTrust'
import ServiceOfferingCard from './ServiceOfferingCard'
import Pagination from '@shared/Pagination'
import Loader from '@shared/atoms/Loader'
import styles from '@shared/AssetList/index.module.css'

const ITEMS_PER_PAGE = 25
const ERROR_MESSAGE =
  'Failed to load service offerings. Please try again later.'
const EMPTY_MESSAGE = 'No service offerings found matching your criteria.'

function useDSIFCatalogue(page: number, itemsPerPage: number) {
  const [offerings, setOfferings] = useState<ResolvedServiceOffering[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState<number>(0)

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchDSIFCatalogueData({
          page: page + 1, // API is 1-indexed, we use 0-indexed
          limit: itemsPerPage
        })

        if (isMounted) {
          setOfferings(data.offerings)
          setTotalPages(data.totalPages)
        }
      } catch (err) {
        console.error('Error loading DSIF Catalogue data:', err)
        if (isMounted) {
          setError(ERROR_MESSAGE)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [page, itemsPerPage])

  return { offerings, loading, error, totalPages }
}

function usePagination() {
  const [currentPage, setCurrentPage] = useState<number>(0)

  const handlePageChange = useCallback((selected: number) => {
    setCurrentPage(selected)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return {
    currentPage,
    handlePageChange
  }
}

export default function DSIFCatalogue(): ReactElement {
  const { currentPage, handlePageChange } = usePagination()
  const { offerings, loading, error, totalPages } = useDSIFCatalogue(
    currentPage,
    ITEMS_PER_PAGE
  )

  if (loading) return <Loader />

  if (error) return <div className={styles.empty}>{error}</div>

  if (offerings.length === 0) {
    return <div className={styles.empty}>{EMPTY_MESSAGE}</div>
  }

  return (
    <>
      <div className={styles.assetList}>
        {offerings.map((offering) => (
          <ServiceOfferingCard key={offering._id} offering={offering} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage + 1}
          onChangePage={handlePageChange}
        />
      )}
    </>
  )
}
