import {type NextFunction, type Request, type Response} from 'express'

import {sendError} from '../utils/errors'

/**
 * Authentication Middleware.
 *
 * Notes:
 * This implementation is intentionally minimal and exists solely to demonstrate authentication and role-based
 * access control within the scope of the exercise.
 *
 * Behaviour:
 * - If no valid token -> 401
 * - If token matches -> attach req.user and continue
 *
 * @example
 * Authorization: Bearer admin-token -> admin
 * Authorization: Bearer user-token -> user
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
	const header = req.header('Authorization')

	// No auth header -> unauthenticated
	if (!header) {
		sendError(res, 401, 'UNAUTHENTICATED', 'Authentication required')
		return
	}

	// Expected format -> Bearer <token>
	const [scheme, token] = header.split(' ')

	if (scheme !== 'Bearer' || !token) {
		sendError(res, 401, 'UNAUTHENTICATED', 'Invalid auth header format')
		return
	}

	// Minimal token-to-role mapping for demonstration purposes.
	// In a real system this would be replaced with better verification, e.g. JWT/OIDC.
	if (token === 'admin-token') {
		req.user = {role: 'admin'}
		next()
		return
	}
	if (token === 'user-token') {
		req.user = {role: 'user'}
		next()
		return
	}

	// Unknown token -> unauthenticated
	sendError(res, 401, 'UNAUTHENTICATED', 'Invalid token')
}
