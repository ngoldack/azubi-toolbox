import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();
if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not defined');
}

export default {
	schema: './src/lib/db/schema/*',
	out: './drizzle',
	driver: 'libsql',
	dbCredentials: {
		url: process.env.DATABASE_URL
	}
} satisfies Config;
