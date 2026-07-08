import { describe, expect, it } from 'vitest'

import { getPaginationItems } from './getPaginationItems'

describe('getPaginationItems', () => {
  it('lists every page when there are few of them', () => {
    expect(getPaginationItems(1, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it('windows around the current page with ellipses', () => {
    expect(getPaginationItems(6, 17)).toEqual([
      1,
      'ellipsis',
      5,
      6,
      7,
      'ellipsis',
      17,
    ])
  })

  it('collapses towards the first page', () => {
    expect(getPaginationItems(1, 17)).toEqual([1, 2, 'ellipsis', 17])
  })

  it('collapses towards the last page', () => {
    expect(getPaginationItems(17, 17)).toEqual([1, 'ellipsis', 16, 17])
  })

  it('shows the page itself instead of an ellipsis for a gap of one', () => {
    expect(getPaginationItems(4, 17)).toEqual([1, 2, 3, 4, 5, 'ellipsis', 17])
  })
})
