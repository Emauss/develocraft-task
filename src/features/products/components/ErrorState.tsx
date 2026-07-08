import styles from './ErrorState.module.css'

interface ErrorStateProps {
  error: Error
  onRetry: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className={styles.wrapper} role="alert">
      <h2 className={styles.title}>Something went wrong</h2>
      <p className={styles.message}>{error.message}</p>
      <button type="button" className={styles.retry} onClick={onRetry}>
        Try again
      </button>
    </div>
  )
}
