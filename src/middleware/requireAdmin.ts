import { type NextFunction, type Request, type Response } from 'express'

import { sendError } from '../utils/errors'

/**
 * Authorisation guard to ensure the user is admin.
 *
 * Assumes that authentication middleware has already populated req.user.
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
	// If there's no user, the route has not been authenticated
	if (!req.user) {
		sendError(res, 401, 'UNAUTHENTICATED', 'Unauthorised')
		return
	}

	// Authenticated but not the required role
	if (req.user.role !== 'admin') {
		sendError(res, 403, 'FORBIDDEN', 'Not allowed')
		return
	}

	next()
}
