import styles from './EmptyState.module.css'

export function EmptyState() {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>No products found</h2>
      <p className={styles.hint}>Try adjusting your search or filters.</p>
    </div>
  )
}
