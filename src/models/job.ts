/**
 * Job
 *
 * Represents a stored Job Posting.
 *
 * Notes:
 * 	- `posted` is treated as a display value in the provided dataset (e.g. "2 days ago"),
 * 	so the API treats it as system-managed rather than user-controlled.
 */
export interface Job {
	id: number
	title: string
	department: string
	location: string
	type: string
	description: string
	posted: string
}

/**
 * Create Job Data
 *
 * Data payload required to create a new Job Posting.
 */
export interface CreateJobData {
	title: string
	department: string
	location: string
	type: string
	description: string
}

/**
 * Update Job Data
 *
 * Data payload for updating a Job Posting (partial update).
 */
export type UpdateJobData = Partial<CreateJobData>
