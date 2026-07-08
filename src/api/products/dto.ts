import { z } from 'zod'

// Schemas mirror the DummyJSON contract for the fields we request via `select`.
// `id` is always included by the API, even when not listed in `select`.

export const productSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  rating: z.number(),
  thumbnail: z.url(),
  category: z.string(),
  // Some products (e.g. groceries) have no brand; the API omits the field.
  brand: z.string().optional(),
})

export type Product = z.infer<typeof productSchema>

export const productListResponseSchema = z.object({
  products: z.array(productSchema),
  total: z.number().int().nonnegative(),
  skip: z.number().int().nonnegative(),
  limit: z.number().int().nonnegative(),
})

export type ProductListResponse = z.infer<typeof productListResponseSchema>

export const categorySchema = z.object({
  slug: z.string(),
  name: z.string(),
  url: z.url(),
})

export const categoryListSchema = z.array(categorySchema)

export type Category = z.infer<typeof categorySchema>
