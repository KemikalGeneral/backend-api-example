import { type Request, type Response } from 'express'

import { type CreateJobData, type UpdateJobData } from '../models/job'
import { JobsService } from '../services/jobs.service'
import { sendError } from '../utils/errors'
import { validateCreateJob, validateUpdateJob } from '../validation/job.validation'

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
	public getAll = (_req: Request, res: Response) => {
		// Request data from the service
		const allJobs = this.service.getAllJobs()

		res.status(200).json(allJobs)
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
