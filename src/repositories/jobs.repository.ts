import fs from 'fs'
import path from 'path'

import { type CreateJobData, type Job, UpdateJobData } from '../models/job'

import type { SortOrder } from '../utils/pagination'

/**
 * Query option for listing Jobs.
 */
export type ListJobsOptions = {
	page: number
	limit: number
	sortBy: keyof Job
	order: SortOrder
}

/**
 * Repository result for a paginated query.
 */
export type ListJobsResult = {
	items: Job[]
	total: number
}

/**
 * JobsRepository
 *
 * In-memory data store for job postings.
 * Loads initial data on startup and provides CRUD operations.
 * Intended for demonstration purposes only.
 *
 * @example
 * const repo = new JobsRepository()
 * const jobs = repo.getAll()
 */
export class JobsRepository {
	private jobs: Job[] = []

	public constructor() {
		this.jobs = this.loadSeedData()
	}

	// Get All
	public getAll(): Job[] {
		return [...this.jobs]
	}

	// Get By ID
	public getById(id: number): Job | undefined {
		return this.jobs.find((job) => job.id === id)
	}

	// Create
	public create(jobData: CreateJobData): Job {
		const generatedId = this.generateId()

		const job: Job = {
			...jobData,
			id: generatedId,
			posted: 'just now'
		}

		this.jobs.push(job)

		return job
	}

	// Update
	public update(id: number, jobData: UpdateJobData): Job | undefined {
		const index = this.jobs.findIndex((job) => job.id === id)

		if (index === -1) return undefined

		const updated: Job = {
			...this.jobs[index],
			...jobData
		}

		this.jobs[index] = updated

		return updated
	}

	// Delete
	public delete(id: number): boolean {
		const lengthBefore = this.jobs.length

		this.jobs = this.jobs.filter((job) => job.id !== id)

		return this.jobs.length !== lengthBefore
	}

	// Load Seed Data
	private loadSeedData(): Job[] {
		const filePath = path.resolve(process.cwd(), 'data.json')
		const raw = fs.readFileSync(filePath, 'utf-8')

		return JSON.parse(raw) as Job[]
	}

	// Generate next ID
	private generateId(): number {
		const maxId = this.jobs.reduce((max, job) => (job.id > max ? job.id : max), 0)

		return maxId + 1
	}

	/**
	 * Lists jobs with sorting and pagination.
	 *
	 * Notes:
	 * - Sorting is applied before pagination so results are deterministic.
	 * - Clone arrays to avoid mutating internal state.
	 */
	public listJobs(options: ListJobsOptions): ListJobsResult {
		const { page, limit, sortBy, order } = options

		// total count BEFORE slicing — needed for pagination meta
		const total = this.jobs.length

		// clone and sort so the internal array isn't mutated
		const sortedJobs = [...this.jobs].sort((a, b) => {
			const av = a[sortBy]
			const bv = b[sortBy]

			/**
			 * Handle common types safely.
			 * - strings: localeCompare
			 * - numbers: numeric compare
			 * - booleans: false < true
			 */
			let result = 0

			// type-safe comparisons
			if (typeof av === 'string' && typeof bv === 'string') {
				result = av.localeCompare(bv)
			} else if (typeof av === 'number' && typeof bv === 'number') {
				result = av - bv
			} else if (typeof av === 'boolean' && typeof bv === 'boolean') {
				result = Number(av) - Number(bv)
			} else {
				// Fallback: stringify (keeps it stable even if field types change later)
				result = String(av).localeCompare(String(bv))
			}

			// flip result if descending
			return order === 'desc' ? -result : result
		})

		const start = (page - 1) * limit
		const end = start + limit

		return {
			items: sortedJobs.slice(start, end),
			total
		}
	}
}
