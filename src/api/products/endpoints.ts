import { apiGet } from '@/api/client'
import {
  categoryListSchema,
  productListResponseSchema,
  type Category,
  type ProductListResponse,
} from './dto'

// Request only the fields the UI renders — keeps payloads small.
const PRODUCT_SELECT =
  'id,title,description,price,rating,thumbnail,category,brand'

export type ProductListRequestParams = {
  limit: number
  skip: number
  sortBy?: string
  order?: 'asc' | 'desc'
}

export const getProducts = (
  params: ProductListRequestParams,
  signal?: AbortSignal,
): Promise<ProductListResponse> => {
  return apiGet('/products', productListResponseSchema, {
    params: { ...params, select: PRODUCT_SELECT },
    signal,
  })
}

export const searchProducts = (
  params: ProductListRequestParams & { q: string },
  signal?: AbortSignal,
): Promise<ProductListResponse> => {
  return apiGet('/products/search', productListResponseSchema, {
    params: { ...params, select: PRODUCT_SELECT },
    signal,
  })
}

export const getProductsByCategory = (
  slug: string,
  params: ProductListRequestParams,
  signal?: AbortSignal,
): Promise<ProductListResponse> => {
  return apiGet(
    `/products/category/${encodeURIComponent(slug)}`,
    productListResponseSchema,
    { params: { ...params, select: PRODUCT_SELECT }, signal },
  )
}

export const getCategories = (signal?: AbortSignal): Promise<Category[]> => {
  return apiGet('/products/categories', categoryListSchema, { signal })
}
