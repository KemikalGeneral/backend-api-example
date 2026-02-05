import 'express-serve-static-core'
import {type AuthenticatedUser} from '../models/auth'

/**
 * Express type augmentation.
 *
 * Extends the Express Request object to include authenticated user information populated by authentication middleware.
 */
declare module 'express-serve-static-core' {
	interface Request {
		user?: AuthenticatedUser
	}
}
