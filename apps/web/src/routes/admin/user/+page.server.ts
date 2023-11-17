import { db } from '$lib/db/client.server';
import { user, userInsertSchema } from '$lib/db/schema/domain.schema';
import logger from '$lib/logger';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { createPromiseClient } from '@connectrpc/connect';
import { UserService } from 'azubi-toolbox-js/dist';
import { createConnectTransport } from '@connectrpc/connect-web';

export const load = async () => {
	const form = await superValidate(userInsertSchema);
	return {
		form,
		users: await db.select().from(user)
	};
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, userInsertSchema);
		if (!form.valid) {
			return fail(400, { form });
		}

		await db.transaction(async (tx) => {
			const [{ id }] = await tx
				.insert(user)
				.values({
					authId: form.data.authId,
					role: form.data.role,
					type: form.data.type
				})
				.returning({ id: user.id });

			logger.info({ id }, 'Created user');
		});

		const transport = createConnectTransport({
			baseUrl: 'http://localhost:8081/'
		});
		const client = createPromiseClient(UserService, transport);

		const res = await client.createUser({
			authId: form.data.authId
		});
		logger.info({ res }, 'Created user in connect');

		return { form };
	}
};
