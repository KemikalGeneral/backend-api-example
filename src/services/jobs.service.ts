import { type CreateJobData, type Job, UpdateJobData } from '../models/job'
import { JobsRepository } from '../repositories/jobs.repository'

import type { ListJobsOptions, ListJobsResult } from '../repositories/jobs.repository'

/**
 * JobsService
 *
 * Encapsulates business logic for job operations and acts as an abstraction between controllers
 * and the data repository.
 *
 * Notes:
 * Business rules are intentionally minimal for this exercise.
 * Additional logic (e.g. normalisation, auditing) would live here in a real system.
 *
 * @example
 * const service = new JobService(new JobsRepository())
 * const jobs = service.getAllJobs()
 */
export class JobsService {
	public constructor(private readonly repo: JobsRepository) {}

	/**
	 * Get All Jobs
	 *
	 * @returns All jobs found
	 */
	// public getAllJobs(): Job[] {
	// 	return this.repo.getAll()
	// }

	public getAllJobs(options: ListJobsOptions): ListJobsResult {
		return this.repo.listJobs(options)
	}

	/**
	 * Get Job by ID
	 *
	 * @param id - Job identifier
	 * @returns Job if found, undefined if not
	 */
	public getJobById(id: number): Job | undefined {
		// Service passes data lookup to the repository
		return this.repo.getById(id)
	}

	/**
	 * Create a Job
	 *
	 * @param jobData - The Job data
	 * @returns //TODO
	 */
	public createJob(jobData: CreateJobData): Job {
		return this.repo.create(jobData)
	}

	/**
	 * Update a Job by ID
	 *
	 * @param id - Job identifier
	 * @param jobData - Partial Job fields to update
	 * @returns Updated Job if found, undefined if not
	 */
	public updateJob(id: number, jobData: UpdateJobData): Job | undefined {
		return this.repo.update(id, jobData)
	}

	/**
	 * Delete a Job by ID
	 *
	 * @param id - Job identifier
	 * @returns True if deleted, false if not found
	 */
	public deleteJob(id: number): boolean {
		return this.repo.delete(id)
	}
}
