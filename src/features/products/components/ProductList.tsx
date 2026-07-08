import { useProducts } from '../hooks/useProducts'
import { EmptyState } from './EmptyState'
import { ErrorState } from './ErrorState'
import { ProductCard } from './ProductCard'
import styles from './ProductList.module.css'
import { ProductListSkeleton } from './ProductListSkeleton'

export function ProductList() {
  const { data, isPending, isError, error, refetch } = useProducts()

  if (isPending) {
    return <ProductListSkeleton />
  }

  if (isError) {
    return <ErrorState error={error} onRetry={() => void refetch()} />
  }

  if (data.products.length === 0) {
    return <EmptyState />
  }

  return (
    <section aria-label="Product list">
      <p className={styles.resultCount} aria-live="polite">
        {data.total} products found
      </p>
      <ul className={styles.grid}>
        {data.products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  )
}
