import { sveltekit } from '@sveltejs/kit/vite';
import pino from 'pino';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite';

const logger = pino({
	name: 'vite',
	level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
});

export default defineConfig({
	server: {
		warmup: {
			// Pre-render all pages at build time. This is optional.
			clientFiles: ['src/routes/**/*.svelte']
		}
	},
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte'
		})
	],
	customLogger: {
		info: (info) => logger.info(info),
		error: (error) => logger.error(error),
		warn: (warn) => logger.warn(warn),
		clearScreen: () => logger.info('clearScreen'),
		hasErrorLogged: () => true,
		hasWarned: true,
		warnOnce: (warn) => logger.warn(warn)
	}
});
