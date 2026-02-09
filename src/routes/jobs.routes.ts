import {Router} from 'express'

import {JobsController} from '../controllers/jobs.controller'
import {authenticate} from '../middleware/auth'
import {requireAdmin} from '../middleware/requireAdmin'
import {JobsRepository} from '../repositories/jobs.repository'
import {JobsService} from '../services/jobs.service'

/**
 * Jobs routes.
 *
 * Read operations are publicly accessible.
 * Write operations require authentication and admin privileges.
 *
 * @example
 * app.use('/jobs', jobsRoutes())
 */
export const jobsRoutes = (): Router => {

	// Create a dedicated router for /jobs endpoints
	const router = Router()

	// Create the data access layer (currently in-memory seeded from data.json)
	const repo = new JobsRepository()

	// Create the service layer which uses repo to fetch/store jobs
	const service = new JobsService(repo)

	// Create the controller layer which uses service to respond to HTTP requests
	const controller = new JobsController(service)

	/**
	 * Routes
	 */

	// Get All
	router.get('/', controller.getAll)

	// Get by ID
	router.get('/:id', controller.getById)

	// The following are protected write operations (admin only)

	// Create
	router.post('/', authenticate, requireAdmin, controller.create)

	// Update
	router.patch('/:id', authenticate, requireAdmin, controller.update)

	// Delete
	router.delete('/:id', authenticate, requireAdmin, controller.delete)

	return router
}
