import { useProductListParams } from '../../hooks/useProductListParams'
import { PAGE_SIZE, useProducts } from '../../hooks/useProducts'
import { EmptyState } from '../EmptyState'
import { ErrorState } from '../ErrorState'
import { Pagination } from '../Pagination'
import { ProductCard } from '../ProductCard'
import { ProductListSkeleton } from '../ProductListSkeleton'
import styles from './ProductList.module.scss'

export function ProductList() {
  const { params, updateParams } = useProductListParams()
  const { data, isPending, isError, error, refetch, isPlaceholderData } =
    useProducts(params)

  if (isPending) {
    return <ProductListSkeleton />
  }

  if (isError) {
    return <ErrorState error={error} onRetry={() => void refetch()} />
  }

  if (data.products.length === 0) {
    return <EmptyState />
  }

  const totalPages = Math.ceil(data.total / PAGE_SIZE)

  return (
    <section aria-label="Product list">
      <p className={styles.resultCount} aria-live="polite">
        {data.total} products found
      </p>
      <ul
        className={
          isPlaceholderData ? `${styles.grid} ${styles.stale}` : styles.grid
        }
      >
        {data.products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
      <Pagination
        page={params.page}
        totalPages={totalPages}
        onPageChange={(page) => {
          if (page !== params.page) {
            updateParams({ page })
          }
        }}
      />
    </section>
  )
}
