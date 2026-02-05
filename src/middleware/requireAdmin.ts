import {type NextFunction, type Request, type Response} from 'express'

/**
 * Authorisation guard to ensure the user is admin.
 *
 * Assumes that authentication middleware has already populated req.user.
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {

	// If there's no user, the route has not been authenticated
	if (!req.user) {
		res.status(401).json({message: 'Unauthorised'})
		return
	}

	// Authenticated but not the required role
	if (req.user.role !== 'admin') {
		res.status(403).json({message: 'Not allowed'})
		return
	}

	next()
}
