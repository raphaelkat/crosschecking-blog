ALTER TABLE `articles` ADD `shareCount` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `categories` DROP COLUMN `views`;