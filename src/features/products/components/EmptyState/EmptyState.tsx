import styles from './EmptyState.module.scss'

type EmptyStateProps = {
  query?: string
  onClear?: () => void
}

export const EmptyState = ({ query, onClear }: EmptyStateProps) => {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>
        {query ? `No results for “${query}”` : 'No products found'}
      </h2>
      <p className={styles.hint}>Try adjusting your search or filters.</p>
      {onClear && (
        <button type="button" className={styles.clear} onClick={onClear}>
          Clear filters
        </button>
      )}
    </div>
  )
}
