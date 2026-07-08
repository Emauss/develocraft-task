import { useQuery } from '@tanstack/react-query'

import { getCategories } from '@/api/products/endpoints'

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: ({ signal }) => getCategories(signal),
    // The category list is effectively static — no need to refetch it
    // every 30 seconds like the product list.
    staleTime: 5 * 60_000,
  })
}
