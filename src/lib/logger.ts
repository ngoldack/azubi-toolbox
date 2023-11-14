import { dev } from '$app/environment';
import pino from 'pino';

export default pino({
	level: dev ? 'debug' : 'info'
});
