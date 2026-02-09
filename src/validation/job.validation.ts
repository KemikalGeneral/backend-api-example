import { type CreateJobData, type UpdateJobData } from '../models/job'

/**
 * Validation helpers for Job create and update requests.
 *
 * These functions perform structural and semantic validation of request bodies
 * before data enters the service and repository layers.
 */

/**
 * Check whether a value is not empty after trimming.
 */
const isNotEmptyString = (value: unknown): value is string => {
	return typeof value === 'string' && value.trim().length > 0
}

/**
 * Validate the POST /jobs request body.
 *
 * @returns An array of error messages
 */
export const validateCreateJob = (body: unknown): string[] => {
	const errors: string[] = []

	// Check if the body is an object
	if (!body || typeof body !== 'object') return ['Request body must be a JSON object']

	const candidateJob = body as Partial<CreateJobData>

	// Required fields for creation
	const requiredFields: Array<keyof CreateJobData> = [
		'title',
		'department',
		'location',
		'type',
		'description'
	]

	for (const field of requiredFields) {
		const value = candidateJob[field]

		if (!isNotEmptyString(value)) errors.push(`${field} is a required field`)
	}

	return errors
}

/**
 * Validate the PATCH /jobs/:id request body.
 *
 * @returns
 * An array of error messages
 */
export const validateUpdateJob = (body: unknown): string[] => {
	const errors: string[] = []

	// Check if the body is an object
	if (!body || typeof body !== 'object') return ['Request body must be a JSON object']

	const candidateJob = body as Partial<UpdateJobData>

	const allowedFields: Array<keyof UpdateJobData> = [
		'title',
		'department',
		'location',
		'type',
		'description'
	]

	// PATCH requests must include at least one updatable field to avoid no-op updates
	const hasAnyFields = allowedFields.some((field) => candidateJob[field] !== undefined)

	if (!hasAnyFields) return ['Request body must include at least one updatable field']

	for (const field of allowedFields) {
		const value = candidateJob[field]

		if (value !== undefined && !isNotEmptyString(value))
			errors.push(`${field} is a required field`)
	}

	return errors
}
