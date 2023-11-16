import { integer, text } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

export const idField = (name: string = 'id', primary: boolean = true, gen: boolean = true) => {
	let id = text(name);
	if (primary) id = id.primaryKey();
	if (gen) id = id.$default(() => nanoid());
	return id;
};
export const defaultFields = {
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$default(() => new Date(Date.now())),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$default(() => new Date(Date.now()))
};
