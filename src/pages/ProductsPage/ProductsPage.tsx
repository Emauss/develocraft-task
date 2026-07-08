import { ProductList } from '../../features/products/components/ProductList'
import { SearchInput } from '../../features/products/components/SearchInput'
import { useProductListParams } from '../../features/products/hooks/useProductListParams'
import styles from './ProductsPage.module.scss'

export function ProductsPage() {
  const { params, updateParams } = useProductListParams()

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Products</h1>
      <div className={styles.toolbar}>
        <SearchInput
          value={params.q}
          onChange={(q) => updateParams({ q }, { replace: true })}
        />
      </div>
      <ProductList />
    </main>
  )
}
