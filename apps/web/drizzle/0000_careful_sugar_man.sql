CREATE TABLE `abteilung` (
	`id` text PRIMARY KEY NOT NULL,
	`updated_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `ausbilder` (
	`id` text PRIMARY KEY NOT NULL,
	`updated_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`user_id` text NOT NULL,
	`ausbildungsberuf` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ausbildungsberuf`) REFERENCES `ausbildungsberuf`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ausbildungsbeauftragter` (
	`id` text PRIMARY KEY NOT NULL,
	`updated_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`user_id` text NOT NULL,
	`abteilung` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`abteilung`) REFERENCES `abteilung`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ausbildungsberuf` (
	`id` text PRIMARY KEY NOT NULL,
	`updated_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `azubi` (
	`id` text PRIMARY KEY NOT NULL,
	`updated_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`user_id` text NOT NULL,
	`ausbildungs_start` integer NOT NULL,
	`ausbildungsberuf` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ausbildungsberuf`) REFERENCES `ausbildungsberuf`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `bericht` (
	`id` text PRIMARY KEY NOT NULL,
	`updated_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`draft` integer NOT NULL,
	`azubi_id` text NOT NULL,
	`zeitraum_start` integer NOT NULL,
	`zeitraum_ende` integer NOT NULL,
	FOREIGN KEY (`azubi_id`) REFERENCES `azubi`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `bericht_genehmingung` (
	`id` text PRIMARY KEY NOT NULL,
	`updated_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`bericht_id` text NOT NULL,
	`ausbildungsbeauftragter_id` text,
	`ausbilder_id` text,
	FOREIGN KEY (`bericht_id`) REFERENCES `bericht`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ausbildungsbeauftragter_id`) REFERENCES `ausbildungsbeauftragter`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`ausbilder_id`) REFERENCES `ausbilder`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `bericht_inhalt` (
	`id` text PRIMARY KEY NOT NULL,
	`updated_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`bericht_id` text NOT NULL,
	`kategorie` text NOT NULL,
	`beschreibung` text NOT NULL,
	`stunden` integer NOT NULL,
	`minuten` integer NOT NULL,
	FOREIGN KEY (`bericht_id`) REFERENCES `bericht`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`kategorie`) REFERENCES `berichts_kategorie`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `berichts_kategorie` (
	`id` text PRIMARY KEY NOT NULL,
	`updated_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`updated_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`auth_id` text NOT NULL,
	`type` text NOT NULL,
	`role` text NOT NULL,
	`vorname` text,
	`nachname` text
);
