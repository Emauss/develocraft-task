import { ProductList } from '../features/products/components/ProductList'
import styles from './ProductsPage.module.css'

export function ProductsPage() {
  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>Products</h1>
      <ProductList />
    </main>
  )
}
