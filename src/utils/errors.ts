import type { Response } from 'express'

export type ApiErrorCode =
	| 'FORBIDDEN' // 403
	| 'INTERNAL_ERROR' // 500
	| 'INVALID_ID' // 400
	| 'INVALID_REQUEST' // 400
	| 'NOT_FOUND' // 404
	| 'UNAUTHENTICATED' // 401
	| 'VALIDATION_ERROR' // 400

export type ApiErrorPayload = {
	error: {
		code: ApiErrorCode
		message: string
		details: Record<string, unknown>
	}
}

export function sendError(
	res: Response,
	status: number,
	code: ApiErrorCode,
	message: string,
	details: Record<string, unknown> = {}
): Response<ApiErrorPayload> {
	return res.status(status).json({
		error: {
			code,
			message,
			details
		}
	})
}
