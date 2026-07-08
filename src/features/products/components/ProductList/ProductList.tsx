import { useProductListParams } from '@/features/products/hooks/useProductListParams'
import { useProducts } from '@/features/products/hooks/useProducts'
import { EmptyState } from '@/features/products/components/EmptyState'
import { ErrorState } from '@/features/products/components/ErrorState'
import { PageSizeSelect } from '@/features/products/components/PageSizeSelect'
import { Pagination } from '@/features/products/components/Pagination'
import { ProductCard } from '@/features/products/components/ProductCard'
import { ProductListSkeleton } from '@/features/products/components/ProductListSkeleton'
import styles from './ProductList.module.scss'

export const ProductList = () => {
  const { params, updateParams } = useProductListParams()
  const { data, isPending, isError, error, refetch, isPlaceholderData } =
    useProducts(params)

  if (isPending) {
    return <ProductListSkeleton count={params.limit} />
  }

  if (isError) {
    return <ErrorState error={error} onRetry={() => void refetch()} />
  }

  if (data.products.length === 0) {
    return (
      <EmptyState
        query={params.q}
        onClear={() =>
          updateParams({ q: '', category: '', sortBy: null, order: 'asc' })
        }
      />
    )
  }

  const totalPages = Math.ceil(data.total / params.limit)

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
      <div className={styles.footer}>
        <div className={styles.footerPagination}>
          <Pagination
            page={params.page}
            totalPages={totalPages}
            onPageChange={(page) => {
              if (page !== params.page) {
                updateParams({ page })
              }
            }}
          />
        </div>
        <div className={styles.footerPageSize}>
          <PageSizeSelect
            value={params.limit}
            onChange={(limit) => updateParams({ limit })}
          />
        </div>
      </div>
    </section>
  )
}
