ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','editor') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `profilePhoto` varchar(500);--> statement-breakpoint
ALTER TABLE `users` ADD `biography` text;