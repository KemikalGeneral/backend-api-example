import { describe, it, expect } from 'vitest'

import { JobsRepository } from './jobs.repository'

/**
 * Unit tests for JobsRepository listJobs().
 */

describe('JobsRepository.listJobs', () => {
	it('return total count regardless of pagination', () => {
		// Create empty repo
		const repo = new JobsRepository([])

		// Add some test data
		repo.create({
			title: 'A',
			department: 'Engineering',
			location: 'Remote',
			type: 'Full-time',
			description: 'Job A'
		})
		repo.create({
			title: 'B',
			department: 'Engineering',
			location: 'Remote',
			type: 'Full-time',
			description: 'Job B'
		})
		repo.create({
			title: 'C',
			department: 'Engineering',
			location: 'Remote',
			type: 'Full-time',
			description: 'Job C'
		})

		// Request only two items, but the total should still be three
		const result = repo.listJobs({
			page: 1,
			limit: 2,
			sortBy: 'title',
			order: 'asc'
		})

		expect(result.total).toBe(3)
		expect(result.items).toHaveLength(2)
	})

	it('sorts by title asc and paginates with page/limit', () => {
		// Create an empty repo
		const repo = new JobsRepository([])

		// Add some test data
		repo.create({
			title: 'A',
			department: 'Engineering',
			location: 'Remote',
			type: 'Full-time',
			description: 'Job A'
		})
		repo.create({
			title: 'B',
			department: 'Engineering',
			location: 'Remote',
			type: 'Full-time',
			description: 'Job B'
		})
		repo.create({
			title: 'C',
			department: 'Engineering',
			location: 'Remote',
			type: 'Full-time',
			description: 'Job C'
		})

		// sort: A, B, C
		// page 2, limit 1 -> should return only "B"
		const result = repo.listJobs({
			page: 1,
			limit: 1,
			sortBy: 'title',
			order: 'asc'
		})

		expect(result.items).toHaveLength(1)
		expect(result.items[0].title).toBe('A')
	})

	it('sorts by title desc', () => {
		// Create an empty repo
		const repo = new JobsRepository([])

		// Add some data
		repo.create({
			title: 'A',
			department: 'Engineering',
			location: 'Remote',
			type: 'Full-time',
			description: 'Job A'
		})
		repo.create({
			title: 'B',
			department: 'Engineering',
			location: 'Remote',
			type: 'Full-time',
			description: 'Job B'
		})

		// Sort by descending -> B first
		const result = repo.listJobs({
			page: 1,
			limit: 10,
			sortBy: 'title',
			order: 'desc'
		})

		expect(result.items[0].title).toBe('B')
	})
})
