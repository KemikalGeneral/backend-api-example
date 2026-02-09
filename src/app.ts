import express, { type Express, type Request, type Response } from 'express'

import { authenticate } from './middleware/auth'
import { errorHandler } from './middleware/errorHandler'
import { requireAdmin } from './middleware/requireAdmin'
import { JobsRepository } from './repositories/jobs.repository'
import { jobsRoutes } from './routes/jobs.routes'

/**
 * Application bootstrap.
 *
 * Creates and configures the Express application instance, wiring middleware and routes without starting
 * the HTTP server.
 *
 * Notes:
 * App creation is separated from server startup to allow easier testing and reuse in different runtime environments.
 *
 * @example
 * import {createApp} from './App'
 * const app = createApp()
 */
export const createApp = (): Express => {
	const app = express()

	// Parse JSON bodies
	app.use(express.json())

	// Ensure Jobs have seeded
	const repo = new JobsRepository()
	console.log(`Loaded ${repo.getAll().length} jobs from data.json`)

	// Health check for quick sanity test
	app.get('/healthCheck', (_req: Request, res: Response) => {
		res.status(200).json({ status: 'ok' })
	})

	app.use('/jobs', jobsRoutes())

	app.use(errorHandler)

	// Test auth
	// no header -> curl http://localhost:3000/admin-check -> 401
	// user token -> curl -H "Authorization: Bearer user-token" http://localhost:3000/admin-check -> 403
	// admin token -> curl -H "Authorization: Bearer admin-token" http://localhost:3000/admin-check -> 200
	app.get('/admin-check', authenticate, requireAdmin, (_req, res) => {
		res.status(200).json({ ok: true })
	})

	return app
}
