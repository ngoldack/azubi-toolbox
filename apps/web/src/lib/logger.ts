import { dev } from '$app/environment';
import { env } from '$env/dynamic/public';
import pino from 'pino';

const level = env.PUBLIC_LOG_LEVEL ?? dev ? 'debug' : 'info';

export default pino({
	name: 'app',
	level: level
});
