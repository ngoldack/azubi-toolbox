import 'dotenv/config';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { env } from '$env/dynamic/private';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import logger from '$lib/logger';
import drizzleLogger from './logger';
import schema from './schema';

let alreadyRan = false;

if (!env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not defined');
}

const migrationClient = createClient({ url: env.DATABASE_URL, authToken: env.DATABASE_AUTH_TOKEN });
const migrationDB = drizzle(migrationClient, { logger: drizzleLogger('migration'), schema });

export const runMigrations = async () => {
	if (alreadyRan) {
		logger.info('Migrations already ran');
		return;
	}
	alreadyRan = true;
	logger.debug('Starting migrations');
	const start = Date.now();
	await migrate(migrationDB, { migrationsFolder: './drizzle' });
	migrationClient.close();
	const ms = Date.now() - start;
	logger.info(`Migrations applied - ${ms}ms`);
};
