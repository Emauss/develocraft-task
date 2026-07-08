import { keepPreviousData, useQuery } from '@tanstack/react-query'

import type { ProductListResponse } from '../../../api/products/dto'
import { getProducts, searchProducts } from '../../../api/products/endpoints'
import type { ProductListParams } from './useProductListParams'

export const PAGE_SIZE = 12

// Endpoint selection: a search query goes to /products/search,
// everything else to the plain /products list.
export function fetchProducts(
  params: ProductListParams,
  signal?: AbortSignal,
): Promise<ProductListResponse> {
  const requestParams = {
    limit: PAGE_SIZE,
    skip: (params.page - 1) * PAGE_SIZE,
    ...(params.sortBy ? { sortBy: params.sortBy, order: params.order } : {}),
  }

  if (params.q) {
    return searchProducts({ ...requestParams, q: params.q }, signal)
  }

  return getProducts(requestParams, signal)
}

export function useProducts(params: ProductListParams) {
  return useQuery({
    queryKey: ['products', { ...params, limit: PAGE_SIZE }],
    queryFn: ({ signal }) => fetchProducts(params, signal),
    placeholderData: keepPreviousData,
  })
}
