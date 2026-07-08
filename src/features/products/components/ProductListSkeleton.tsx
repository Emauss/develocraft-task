import { PAGE_SIZE } from '../hooks/useProducts'
import gridStyles from './ProductList.module.css'
import styles from './ProductListSkeleton.module.css'

export function ProductListSkeleton() {
  return (
    <div role="status" aria-label="Loading products">
      <ul className={gridStyles.grid} aria-hidden="true">
        {Array.from({ length: PAGE_SIZE }, (_, index) => (
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
