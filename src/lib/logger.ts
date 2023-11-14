import { dev } from '$app/environment';
import pino from 'pino';

export default pino({
    name: 'app',
	level: dev ? 'debug' : 'info'
});
