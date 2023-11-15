import defaultLogger from '$lib/logger';

let ran = false;
const logger = defaultLogger.child({ name: 'db/seed' });
export const seed = async () => {
	if (ran) return;
	ran = true;
	logger.debug('Start seeding database...');

	logger.info('Seeded database!');
};
