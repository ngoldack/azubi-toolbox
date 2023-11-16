import { db } from '$lib/db/client.server';
import { user, userInsertSchema } from '$lib/db/schema/domain.schema';
import logger from '$lib/logger';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

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

		return { form };
	}
};
