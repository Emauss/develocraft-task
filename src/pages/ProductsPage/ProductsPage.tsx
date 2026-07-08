import { CategoryFilter } from '@/features/products/components/CategoryFilter'
import { ProductList } from '@/features/products/components/ProductList'
import { SearchInput } from '@/features/products/components/SearchInput'
import { SortControls } from '@/features/products/components/SortControls'
import {
  defaultProductListParams,
  useProductListParams,
} from '@/features/products/hooks/useProductListParams'
import styles from './ProductsPage.module.scss'

export const ProductsPage = () => {
  const { params, updateParams } = useProductListParams()

  const hasActiveFilters =
    params.q !== '' || params.category !== '' || params.sortBy !== null

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Products</h1>
      <div className={styles.toolbar}>
        <SearchInput
          value={params.q}
          onChange={(q) => updateParams({ q }, { replace: true })}
        />
        <CategoryFilter
          value={params.category}
          onChange={(category) => updateParams({ category })}
        />
        <SortControls
          sortBy={params.sortBy}
          order={params.order}
          onSortByChange={(sortBy) => updateParams({ sortBy })}
          onOrderChange={(order) => updateParams({ order })}
        />
        {hasActiveFilters && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={() => updateParams(defaultProductListParams)}
          >
            Clear filters
          </button>
        )}
      </div>
      <ProductList />
    </main>
  )
}
