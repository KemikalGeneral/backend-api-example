import { createApp } from './app'

/**
 * Server entry point.
 *
 * Starts the HTTP server using the configured Express application.
 *
 * @example
 * npm run dev
 */
const startServer = (): void => {
	const app = createApp()
	const port = Number(process.env.PORT) || 3000

	app.listen(port, () => console.log(`API listening on http://localhost:${port}`))
}

startServer()
