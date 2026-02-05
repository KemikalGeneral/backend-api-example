/**
 * Minimal Auth model.
 *
 * Notes:
 * - A full user system has been deliberately avoided as it's out of scope for the time given (three hours).
 * - This type is so that middleware can attach an unauthenticated user to the request.
 */
export type UserRole = 'admin' | 'user'

export interface AuthenticatedUser {
	role: UserRole
}
