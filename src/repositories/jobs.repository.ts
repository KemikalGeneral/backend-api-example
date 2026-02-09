import fs from 'fs'
import path from 'path'

import { type CreateJobData, type Job, UpdateJobData } from '../models/job'

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
}
