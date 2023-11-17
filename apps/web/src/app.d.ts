// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { User as DomainUser } from '$lib/db/schema/domain.schema';
import 'unplugin-icons/types/svelte';
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: DomainUser | undefined;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export declare module '@auth/core/types' {
	interface JWT {
		authId: string;
	}
	interface Session {
		user: {
			authId?: string;
		} & DefaultSession['user'];
	}
}

export {};
