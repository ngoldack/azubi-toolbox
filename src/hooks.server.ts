import { env } from '$env/dynamic/private';
import { startQueue } from '$lib/scheduler/queue.server';
import logger from '$lib/logger';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { dev } from '$app/environment';

// This will run the migrations when the server starts
// unless the DISABLE_MIGRATIONS environment variable is set to "true"
// When running the dev server, migrations are applied after the first request
if (env.DISABLE_MIGRATIONS !== 'true') {
	const { runMigrations } = await import('$lib/db/migrate.server');
	await runMigrations();
}

if (dev && env.DISABLE_SEEDING !== 'true') {
	const { seed } = await import('$lib/db/seed');
	await seed();
}

// Startup the queue
await startQueue();

// Log all requests
const log: Handle = async ({ event, resolve }) => {
	const start = Date.now();
	const resp = await resolve(event);
	const ms = Date.now() - start;

	logger.info(`${event.request.method} ${event.request.url} - ${resp.status} - ${ms}ms`);

	return resp;
};

export const handle = sequence(log);
