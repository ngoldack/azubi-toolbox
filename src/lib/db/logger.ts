import logger from '$lib/logger';
import type { Logger } from 'drizzle-orm';

export default {
	logQuery(query, params) {
		logger.debug(params, query);
	}
} satisfies Logger;
