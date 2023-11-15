import { Queue, type JobsOptions, Worker } from 'bullmq';
import { startup } from './jobs/startup';
import logger from './logger';
import { env } from '$env/dynamic/private';

const queue = new Queue('main', {
	connection: {
		host: env.QUEUE_REDIS_HOST ?? 'localhost',
		port: +(env.QUEUE_REDIS_PORT ?? 6379),
		password: env.QUEUE_REDIS_PASSWORD ?? undefined,
		db: +(env.QUEUE_REDIS_DB ?? 0)
	}
});

const registerWorkers = async () => {
	const startupWorker = new Worker('startup', startup);

	logger.trace({ startupWorker }, 'Registered workers');
};

export const addJob = async (name: string, payload?: unknown, options?: JobsOptions) => {
	await queue.add(name, payload, options);
};

export const startQueue = async () => {
	await registerWorkers();
	await addJob('startup');
};

export const stopQueue = async () => {
	await queue.close();
};
