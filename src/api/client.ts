import { z } from 'zod'

export type QueryParams = Record<string, string | number | undefined>

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export class ApiValidationError extends Error {
  constructor(path: string, details: string) {
    super(`Unexpected response shape from ${path}:\n${details}`)
    this.name = 'ApiValidationError'
  }
}

const buildUrl = (path: string, params?: QueryParams): string => {
  const baseUrl = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined) {
      searchParams.set(key, String(value))
    }
  }
  const query = searchParams.toString()
  return query ? `${baseUrl}${path}?${query}` : `${baseUrl}${path}`
}

interface ApiGetOptions {
  params?: QueryParams
  signal?: AbortSignal
}

export const apiGet = async <T>(
  path: string,
  schema: z.ZodType<T>,
  { params, signal }: ApiGetOptions = {},
): Promise<T> => {
  const response = await fetch(buildUrl(path, params), { signal })
  if (!response.ok) {
    throw new ApiError(
      `GET ${path} failed with status ${response.status}`,
      response.status,
    )
  }
  const data: unknown = await response.json()
  const result = schema.safeParse(data)
  if (!result.success) {
    throw new ApiValidationError(path, z.prettifyError(result.error))
  }
  return result.data
}
