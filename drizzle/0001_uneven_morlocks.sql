CREATE TABLE `leads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text,
	`project_type` text NOT NULL,
	`package_interest` text,
	`project_summary` text NOT NULL,
	`preferred_time` text,
	`consent` integer DEFAULT false NOT NULL,
	`source` text DEFAULT 'assistente_site' NOT NULL,
	`status` text DEFAULT 'novo' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
