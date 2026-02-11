import { type Request, type Response } from 'express'

import { type CreateJobData, type UpdateJobData, type Job } from '../models/job'
import { JobsService } from '../services/jobs.service'
import { sendError } from '../utils/errors'
import { buildPaginationMeta, parsePaginationQuery } from '../utils/pagination'
import { validateCreateJob, validateUpdateJob } from '../validation/job.validation'

/**
 * Allowed fields to sort by.
 * Keep this tight so behaviour stays predictable.
 */
const ALLOWED_SORT_FIELDS: Array<keyof Job> = [
	'id',
	'title',
	'department',
	'location',
	'type',
	'posted'
]

/**
 * Controller for Job endpoints.
 *
 * Responsible for handling HTTP requests and responses for job-related routes.
 * Delegates business logic to the service layer and performs request validation and HTTP-specific error handling.
 *
 * @example
 * const controller = new JobsController(service)
 * app.get('/jobs', controller.getAll)
 */
export class JobsController {
	public constructor(private readonly service: JobsService) {}

	/**
	 * Handle GET /jobs
	 *
	 * @param _req
	 * @param res
	 */
	public getAll = (req: Request, res: Response) => {
		try {
			// Parse + sanitise query params
			const { page, limit, sortBy, order } = parsePaginationQuery(
				req.query as unknown as Record<string, unknown>,
				ALLOWED_SORT_FIELDS as unknown as string[]
			)

			// Ask service for paginated data
			const result = this.service.getAllJobs({
				page,
				limit,
				sortBy: sortBy as keyof Job,
				order
			})

			// Build metadata for client pagination UI
			const meta = buildPaginationMeta({ page, limit, sortBy, order }, result.total)

			// Return both data and meta
			res.status(200).json({ data: result.items, meta })
		} catch {
			sendError(res, 500, 'INTERNAL_ERROR', 'An unexpected error occurred')
		}
	}

	/**
	 * Handle GET /jobs/:id
	 *
	 * @param req
	 * @param res
	 */
	public getById = (req: Request, res: Response) => {
		// Extract ID from URL params
		const id = Number(req.params.id)

		// Validate ID is a number
		if (Number.isNaN(id)) {
			sendError(res, 400, 'INVALID_ID', 'Invalid Job ID')
			return
		}

		// Request Job from service
		const currentJob = this.service.getJobById(id)

		// Handle Job not found
		if (!currentJob) {
			sendError(res, 404, 'NOT_FOUND', 'Job not found')
			return
		}

		res.status(200).json(currentJob)
	}

	/**
	 * Handle POST /jobs
	 *
	 * @param req
	 * @param res
	 */
	public create = (req: Request, res: Response) => {
		// Validate incoming payload
		const errors = validateCreateJob(req.body)

		if (errors.length) {
			sendError(res, 400, 'VALIDATION_ERROR', 'Validation failed', { errors })
			return
		}

		// Explicitly whitelist fields to prevent overriding system-managed values
		const jobData: CreateJobData = {
			title: req.body.title,
			department: req.body.department,
			location: req.body.location,
			type: req.body.type,
			description: req.body.description
		}
		const createdJob = this.service.createJob(jobData)

		res.status(201).json(createdJob)
	}

	/**
	 * Handle PATCH /jobs/:id
	 */
	public update = (req: Request, res: Response) => {
		// Extract ID from URL params
		const id = Number(req.params.id)

		// Validate ID
		if (Number.isNaN(id)) {
			sendError(res, 400, 'INVALID_ID', 'Invalid Job ID')
			return
		}

		// Validate request body
		const errors = validateUpdateJob(req.body)

		if (errors.length) {
			sendError(res, 400, 'VALIDATION_ERROR', 'Validation failed', { errors })
			return
		}

		const jobData: UpdateJobData = {}

		// Explicitly whitelist allowed fields to prevent mass-assignment
		if (req.body.title !== undefined) jobData.title = req.body.title
		if (req.body.department !== undefined) jobData.department = req.body.department
		if (req.body.location !== undefined) jobData.location = req.body.location
		if (req.body.type !== undefined) jobData.type = req.body.type
		if (req.body.description !== undefined) jobData.description = req.body.description

		const updatedJob = this.service.updateJob(id, jobData)

		if (!updatedJob) {
			sendError(res, 404, 'NOT_FOUND', 'Job not found')
			return
		}

		res.status(200).json(updatedJob)
	}

	/**
	 * Handle DELETE /jobs/:id
	 */
	public delete = (req: Request, res: Response) => {
		// Extract ID from URL params
		const id = Number(req.params.id)

		// Validate ID
		if (Number.isNaN(id)) {
			sendError(res, 400, 'INVALID_ID', 'Invalid Job ID')
			return
		}

		const deletedJob = this.service.deleteJob(id)

		if (!deletedJob) {
			sendError(res, 404, 'NOT_FOUND', 'Job not found')
			return
		}

		res.status(204).send()
	}
}
