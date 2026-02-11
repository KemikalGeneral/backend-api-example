/**
 * Pagination and sorting helper utilities.
 *
 * What this does:
 * - Converts query params into safe numbers/values
 * - Applies defaults
 * - Validates ranges and known sort fields
 */

// Allowed sort order values
export type SortOrder = 'asc' | 'desc'

// Normalised pagination query after parsing
export type PaginationQuery = {
	page: number
	limit: number
	sortBy: string
	order: SortOrder
}

// Metadata returned to the client alongside data
export type PaginationMeta = {
	page: number
	limit: number
	total: number
	totalPages: number
	hasNext: boolean
	hasPrev: boolean
	sortBy: string
	order: SortOrder
}

// Safe defaults so the API behaves predictably
const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

/**
 * Convert an unknown query param to a positive integer or fallback
 */
const parsePositiveInt = (value: unknown, fallback: number): number => {
	if (typeof value !== 'string') return fallback

	const n = Number.parseInt(value, 10)
	if (Number.isNaN(n) || n < 1) return fallback

	return n
}

/**
 * Parses pagination and sorting from Express query params.
 *
 * @param query Express req.query
 * @param allowedSortedFields Whitelist of valid sort fields
 */
export const parsePaginationQuery = (
	query: Record<string, unknown>,
	allowedSortedFields: string[]
): PaginationQuery => {
	// page number (1-based)
	const page = parsePositiveInt(query.page, DEFAULT_PAGE)

	// limit with hard cap to prevent abuse
	const limitRaw = parsePositiveInt(query.limit, DEFAULT_LIMIT)
	const limit = Math.min(limitRaw, MAX_LIMIT)

	// only allow sorting by known fields
	const sortByRaw = typeof query.sortBy === 'string' ? query.sortBy : 'id'
	const sortBy = allowedSortedFields.includes(sortByRaw) ? sortByRaw : 'id'

	// normalise order to asc/desc only
	const orderRaw = typeof query.order === 'string' ? query.order : 'asc'
	const order: SortOrder = orderRaw === 'desc' ? 'desc' : 'asc'

	return { page, limit, sortBy, order }
}

/**
 * Builds pagination metadata for responses.
 */
export const buildPaginationMeta = (query: PaginationQuery, total: number): PaginationMeta => {
	const totalPages = Math.max(1, Math.ceil(total / query.limit))

	return {
		page: query.page,
		limit: query.limit,
		total,
		totalPages,
		hasNext: query.page < totalPages,
		hasPrev: query.page > 1,
		sortBy: query.sortBy,
		order: query.order
	}
}
