export type PaginationItem = number | 'ellipsis'

const MAX_FLAT_PAGES = 7

// Windowed page list: first, last and the current page's neighbours,
// with ellipses for the gaps, e.g. [1, '…', 5, 6, 7, '…', 17].
export const getPaginationItems = (
  page: number,
  totalPages: number,
): PaginationItem[] => {
  if (totalPages <= MAX_FLAT_PAGES) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const shown = new Set<number>()
  for (const candidate of [1, page - 1, page, page + 1, totalPages]) {
    if (candidate >= 1 && candidate <= totalPages) {
      shown.add(candidate)
    }
  }

  const pages = [...shown].sort((a, b) => a - b)
  const items: PaginationItem[] = []
  for (const [index, pageNumber] of pages.entries()) {
    const previous = pages[index - 1]
    if (previous !== undefined && pageNumber - previous === 2) {
      // A gap of exactly one page: show the page itself instead of an ellipsis.
      items.push(pageNumber - 1)
    } else if (previous !== undefined && pageNumber - previous > 2) {
      items.push('ellipsis')
    }
    items.push(pageNumber)
  }
  return items
}
