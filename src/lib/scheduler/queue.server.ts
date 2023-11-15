import type { ConnectionOptions, WorkerOptions } from 'bullmq';
import logger from './logger';
import { env } from '$env/dynamic/private';

export const connectionConfig: ConnectionOptions = {
	host: env.QUEUE_REDIS_HOST ?? 'localhost',
	port: +(env.QUEUE_REDIS_PORT ?? 6379),
	password: env.QUEUE_REDIS_PASSWORD ?? undefined,
	db: +(env.QUEUE_REDIS_DB ?? 0)
};
export const workerConfig: WorkerOptions = {
	connection: connectionConfig
};

export const registerWorkers = async () => {
	logger.trace({}, 'Registered workers');
};
