import { useId } from 'react'

import { useCategories } from '@/features/products/hooks/useCategories'
import styles from './CategoryFilter.module.scss'

interface CategoryFilterProps {
  value: string
  onChange: (category: string) => void
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const selectId = useId()
  const { data: categories, isPending, isError } = useCategories()

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={selectId}>
        Category
      </label>
      <select
        id={selectId}
        className={styles.select}
        value={value}
        disabled={isPending || isError}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">All categories</option>
        {categories?.map((category) => (
          <option key={category.slug} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  )
}
