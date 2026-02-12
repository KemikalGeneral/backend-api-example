import { describe, it, expect } from 'vitest'

import { buildPaginationMeta, parsePaginationQuery } from './pagination'

/**
 * Unit tests for pagination helpers.
 */

describe(parsePaginationQuery, () => {
	it('uses defaults when query parameters are missing', () => {
		// Arrange: empty query object
		const query = {}

		// Act: parse with allowed sort fields
		const result = parsePaginationQuery(query, ['id', 'title'])

		// Assert: default are applied
		expect(result.page).toBe(1)
		expect(result.limit).toBe(20)
		expect(result.sortBy).toBe('id')
		expect(result.order).toBe('asc')
	})

	it('clamps limit, and rejects invalid values', () => {
		// Arrange: invalid page, huge limit
		const query = {
			page: 0,
			limit: 99999
		}

		// Act: parse allowed field(s)
		const result = parsePaginationQuery(query, ['id'])

		// Assert: defaults are applied
		expect(result.page).toBe(1)
		expect(result.limit).toBe(20)
	})

	it('falls back to ID when sortBy is not allowed', () => {
		const query = {
			sortBy: 'posted',
			order: 'desc'
		}

		const result = parsePaginationQuery(query, ['id', 'title'])

		expect(result.sortBy).toBe('id')
		expect(result.order).toBe('desc')
	})
})

describe('buildPaginationMeta', () => {
	it('calculates totalPages and next/prev flags', () => {
		// Arrange: page 2 of a 45 item list with limit 20
		const query = {
			page: 2,
			limit: 20,
			sortBy: 'id',
			order: 'asc' as const
		}

		const meta = buildPaginationMeta(query, 45)

		expect(meta.total).toBe(45)
		expect(meta.totalPages).toBe(3)
		expect(meta.hasPrev).toBe(true)
		expect(meta.hasNext).toBe(true)
	})
})
