import defaultLogger from '$lib/logger';
import type { LoggerInstance } from '@auth/core/types';

const logger = defaultLogger.child({ name: 'auth' });

export const authLogger: LoggerInstance = {
	debug: (message, metadata) => logger.debug(metadata, message),
	warn: (code) => logger.warn(code),
	error: (error) => logger.error(error, `${error.name} - ${error.message}`)
};
