
import { sveltekit } from '@sveltejs/kit/vite';
import pino from 'pino';
import { defineConfig } from 'vite';

const logger = pino({
	level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
})

export default defineConfig({
	plugins: [sveltekit()],
	customLogger: {
		info: (info) => logger.info(info),
		error: (error) => logger.error(error),
		warn: (warn) => logger.warn(warn),
		clearScreen: () => logger.info('clearScreen'),
		hasErrorLogged: () => true,
		hasWarned: true,
		warnOnce: (warn) => logger.warn(warn),
	}
});