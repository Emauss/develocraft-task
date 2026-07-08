import type { Product } from '@/api/products/dto'
import styles from './ProductCard.module.scss'

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

interface ProductCardProps {
  product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <article className={styles.card}>
      <img
        src={product.thumbnail}
        alt=""
        width={280}
        height={280}
        loading="lazy"
        className={styles.thumbnail}
      />
      <div className={styles.body}>
        <h2 className={styles.title}>{product.title}</h2>
        <p className={styles.meta}>
          {product.brand ? `${product.brand} · ` : ''}
          {product.category}
        </p>
        <p className={styles.description}>{product.description}</p>
        <p className={styles.footer}>
          <span className={styles.price}>
            {priceFormatter.format(product.price)}
          </span>
          <span
            className={styles.rating}
            aria-label={`Rated ${product.rating} out of 5`}
          >
            ★ {product.rating.toFixed(1)}
          </span>
        </p>
      </div>
    </article>
  )
}
