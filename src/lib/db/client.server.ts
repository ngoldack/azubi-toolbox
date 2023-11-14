import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import drizzleLogger from './logger';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not defined');
}

const queryClient = createClient({ url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN });

export const db = drizzle(queryClient, { logger: drizzleLogger });
