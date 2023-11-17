import { env } from '$env/dynamic/private';
import { redirect, type Handle, error } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { dev } from '$app/environment';
import { registerWorkers } from '$lib/scheduler/queue.server';
import { SvelteKitAuth } from '@auth/sveltekit';
import { getProviders } from '$lib/auth/provider.server';
import { db } from '$lib/db/client.server';
import { eq, sql } from 'drizzle-orm';
import { UserRole, UserType, user as userTable } from '$lib/db/schema/domain.schema';
import { getAuthID } from '$lib/auth/id.server';
import { authLogger } from '$lib/auth/logger';
import defaultLogger from '$lib/logger';

const logger = defaultLogger.child({ name: 'hooks' });

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

// Startup background workers
await registerWorkers();

// Log all requests
const log: Handle = async ({ event, resolve }) => {
	const start = Date.now();
	const resp = await resolve(event);
	const ms = Date.now() - start;

	logger.info(`${event.request.method} ${event.request.url} - ${resp.status} - ${ms}ms`);

	return resp;
};

const authentication: Handle = async ({ event, ...args }) => {
	const providers = getProviders();
	logger.debug(`Authentication providers registered: ${providers.map((p) => p.name).join(', ')}`);

	if (providers.length === 0) {
		throw new Error('No authentication providers configured');
	}

	if (providers.length > 1) {
		logger.warn(
			'Multiple authentication providers configured. Only the first provider will be used.'
		);
	}

	const sveltekitAuth = SvelteKitAuth({
		providers: providers.slice(0, 1),
		trustHost: true,
		debug: dev && logger.level === 'debug',
		logger: authLogger,
		callbacks: {
			jwt: async ({ token, profile, account, user, session, trigger }) => {
				logger.trace({ token, profile, account, user, session, trigger }, 'JWT callback');
				if (account && profile) {
					return {
						...token,
						authId: getAuthID(account, profile)
					};
				}
				return token;
			},
			session: async ({ session, token, user, newSession, trigger }) => {
				logger.trace({ session, token, user, newSession, trigger }, 'Session callback');
				return {
					...session,
					user: {
						...session.user,
						authId: token.authId
					}
				};
			},
			signIn: async ({ account, profile }) => {
				const [{ count }] = await db.select({ count: sql<number>`COUNT(*)` }).from(userTable);
				const authId = getAuthID(account!, profile!);
				if (!count || count === 0) {
					await db.insert(userTable).values({
						authId: authId,
						type: UserType.AUSBILDER,
						role: UserRole.ADMIN
					});
					return true;
				}

				const users = await db.select().from(userTable).where(eq(userTable.authId, authId));
				return users.length !== 0;
			}
		}
	});

	return sveltekitAuth({ event, ...args });
};

const authorization: Handle = async ({ event, resolve }) => {
	const session = await event.locals.getSession();

	if (!session && !event.url.pathname.startsWith('/auth')) {
		throw redirect(303, '/auth/signin');
	}

	return resolve(event);
};

const userdata: Handle = async ({ event, resolve }) => {
	const session = await event.locals.getSession();
	if (!session?.user.authId) {
		logger.error({ session, event }, 'No authId in session');
		throw error(403, 'Forbidden');
	}

	const [user] = await db.select().from(userTable).where(eq(userTable.authId, session.user.authId));
	if (!user) {
		return resolve(event);
	}

	event.locals.user = user;
	return resolve(event);
};

// This hook will check if the user is authenticated and has the correct role for the route
export const guard: Handle = async ({ event, resolve }) => {
	const user = event.locals.user;
	if (!user) {
		throw error(403, 'Forbidden');
	}

	if (!event.route.id?.startsWith('/admin')) {
		if (user.role !== UserRole.ADMIN) {
			logger.error({ user }, 'User is not an admin');
			throw error(403, 'Forbidden');
		}
	}

	return resolve(event);
};

export const handle = sequence(log, authentication, authorization, userdata, guard);
