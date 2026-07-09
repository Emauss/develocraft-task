import { DEFAULT_PAGE_SIZE } from '@/features/products/hooks/useProductListParams'
import gridStyles from '@/features/products/components/ProductList/ProductList.module.scss'
import styles from './ProductListSkeleton.module.scss'

type ProductListSkeletonProps = {
  count?: number
}

export const ProductListSkeleton = ({
  count = DEFAULT_PAGE_SIZE,
}: ProductListSkeletonProps) => {
  return (
    <div role="status" aria-label="Loading products">
      <ul className={gridStyles.grid} aria-hidden="true">
        {Array.from({ length: count }, (_, index) => (
          <li key={index}>
            <div className={styles.card}>
              <div className={styles.thumbnail} />
              <div className={styles.lines}>
                <div className={`${styles.line} ${styles.lineWide}`} />
                <div className={`${styles.line} ${styles.lineNarrow}`} />
                <div className={styles.line} />
                <div className={styles.line} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
