import logger from '$lib/logger';
import type { Logger } from 'drizzle-orm';

export default (name?: string): Logger => {
	return {
		logQuery(query, params) {
			logger.child({ name: name ?? 'drizzle' }).debug(params, query);
		}
};
};
