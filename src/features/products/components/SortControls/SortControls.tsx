import { useId } from 'react'

import {
  SORT_FIELDS,
  type SortField,
  type SortOrder,
} from '@/features/products/hooks/useProductListParams'
import styles from './SortControls.module.scss'

const SORT_LABELS: Record<SortField, string> = {
  title: 'Title',
  price: 'Price',
  rating: 'Rating',
}

interface SortControlsProps {
  sortBy: SortField | null
  order: SortOrder
  onSortByChange: (sortBy: SortField | null) => void
  onOrderChange: (order: SortOrder) => void
}

export const SortControls = ({
  sortBy,
  order,
  onSortByChange,
  onOrderChange,
}: SortControlsProps) => {
  const sortById = useId()
  const orderId = useId()

  return (
    <div className={styles.wrapper}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor={sortById}>
          Sort by
        </label>
        <select
          id={sortById}
          className={styles.select}
          value={sortBy ?? ''}
          onChange={(event) => {
            const value = event.target.value
            onSortByChange(SORT_FIELDS.find((field) => field === value) ?? null)
          }}
        >
          <option value="">Default</option>
          {SORT_FIELDS.map((field) => (
            <option key={field} value={field}>
              {SORT_LABELS[field]}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor={orderId}>
          Order
        </label>
        <select
          id={orderId}
          className={styles.select}
          value={order}
          disabled={sortBy === null}
          onChange={(event) =>
            onOrderChange(event.target.value === 'desc' ? 'desc' : 'asc')
          }
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  )
}
