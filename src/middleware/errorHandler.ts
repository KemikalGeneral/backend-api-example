import {sendError} from '../utils/errors'

import type {NextFunction, Request, Response} from 'express'

/**
 * Global Express error handler.
 *
 * Ensures all uncaught errors return a consistent API error shape.
 * Behaviour differs slightly between development and production.
 *
 * Usage:
 * - Must be registered AFTER all routes in app.ts:
 *   app.use(errorHandler)
 */
export const errorHandler = (
	err: unknown,
	req: Request,
	res: Response,
	_next: NextFunction
): void => {

	// If headers have already been sent, let Express handle it
	if (res.headersSent) return

	const isProduction = process.env.NODE_ENV === 'production'

	// Handle malformed JSON from express.json()
	if (err instanceof SyntaxError) {
		sendError(res, 400, 'INVALID_REQUEST', 'Malformed JSON in request body')
		return
	}


	// Environment-aware logging:
	// - dev: full error
	// - prod: minimal message
	if (isProduction) {
		console.error('Unhandled error: ', err instanceof Error ? err.message : err)
	} else {
		console.error('Unhandled error (dev): ', err)
	}

	sendError(res, 500, 'INTERNAL_ERROR', 'An unexpected error occurred')
}
