import {type NextFunction, type Request, type Response} from 'express'

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
		res.status(401).json({message: 'Missing Auth header'})
		return
	}

	// Expected format -> Bearer <token>
	const [scheme, token] = header.split(' ')

	if (scheme !== 'Bearer' || !token) {
		res.status(401).json({message: 'Invalid Auth header format'})
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
	res.status(401).json({message: 'Invalid token'})
}
