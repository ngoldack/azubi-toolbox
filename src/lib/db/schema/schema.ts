import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';

export type userRole = 'user' | 'admin';
export type userType = 'ausbilder' | 'ausbildungsbeauftragter' | 'azubi';

export const idField = text('id')
	.primaryKey()
	.$default(() => createId());
export const defaultFields = {
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$default(() => new Date(Date.now())),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$default(() => new Date(Date.now()))
};

export const abteilung = sqliteTable('abteilung', {
	id: idField,
	...defaultFields,
	name: text('name').notNull()
});

export const ausbildungsberuf = sqliteTable('ausbildungsberuf', {
	id: idField,
	...defaultFields,
	name: text('name').notNull()
});

export const user = sqliteTable('user', {
	id: idField,
	...defaultFields,

	type: text('type')
		.$type<userRole>()
		.$default(() => 'user')
		.notNull(),
	role: text('role').$type<userType>().notNull(),

	vorname: text('vorname').notNull(),
	nachname: text('nachname').notNull()
});

export const azubi = sqliteTable('azubi', {
	id: idField,
	...defaultFields,
	userId: text('user_id')
		.notNull()
		.references(() => user.id),

	ausbildungsStart: integer('ausbildungs_start', { mode: 'timestamp' }).notNull(),
	ausbildungsEnde: integer('ausbildungs_start', { mode: 'timestamp' }).notNull(),
	ausbildungsberuf: text('ausbildungsberuf')
		.references(() => ausbildungsberuf.id)
		.notNull()
});

export const ausbilder = sqliteTable('ausbilder', {
	id: idField,
	...defaultFields,
	userId: text('user_id')
		.notNull()
		.references(() => user.id),

	ausbildungsberuf: text('ausbildungsberuf')
		.references(() => ausbildungsberuf.id)
		.notNull()
});

export const ausbildungsbeauftragter = sqliteTable('ausbildungsbeauftragter', {
	id: idField,
	...defaultFields,
	userId: text('user_id')
		.notNull()
		.references(() => user.id),

	abteilung: text('abteilung')
		.notNull()
		.references(() => abteilung.id)
		.notNull()
});

export const bericht = sqliteTable('bericht', {
	id: idField,
	...defaultFields,
	draft: integer('draft', { mode: 'boolean' }).notNull(),

	azubiId: text('azubi_id')
		.notNull()
		.references(() => azubi.id),

	zeitraumStart: integer('zeitraum_start', { mode: 'timestamp' }).notNull(),
	zeitraumEnde: integer('zeitraum_ende', { mode: 'timestamp' }).notNull()
});

export const berichtsKategorie = sqliteTable('berichts_kategorie', {
	id: idField,
	...defaultFields,
	name: text('name').notNull()
});

export const bericht_inhalt = sqliteTable('bericht_inhalt', {
	id: idField,
	...defaultFields,
	berichtId: text('bericht_id')
		.notNull()
		.references(() => bericht.id),

	kategorie: text('kategorie')
		.notNull()
		.references(() => berichtsKategorie.id),

	beschreibung: text('beschreibung').notNull(),
	stunden: integer('stunden').notNull(),
	minuten: integer('minuten').notNull()
});

export const bericht_genehmigung = sqliteTable('bericht_genehmingung', {
	id: idField,
	...defaultFields,

	berichtId: text('bericht_id')
		.notNull()
		.references(() => bericht.id)
		.notNull(),

	ausbildungsbeauftragterId: text('ausbildungsbeauftragter_id').references(
		() => ausbildungsbeauftragter.id
	),
	ausbilderId: text('ausbilder_id').references(() => ausbilder.id)
});
