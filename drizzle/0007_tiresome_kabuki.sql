CREATE TABLE `articleTranslations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`articleId` int NOT NULL,
	`language` varchar(10) NOT NULL,
	`title` varchar(500) NOT NULL,
	`slug` varchar(500) NOT NULL,
	`metaDescription` varchar(500),
	`content` longtext,
	`translatedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `articleTranslations_id` PRIMARY KEY(`id`),
	CONSTRAINT `articleTranslations_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `categoryTranslations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`categoryId` int NOT NULL,
	`language` varchar(10) NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `categoryTranslations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `languagePreferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`preferredLanguage` varchar(10) NOT NULL DEFAULT 'en',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `languagePreferences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `translationMetadata` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contentType` varchar(50) NOT NULL,
	`contentId` int NOT NULL,
	`language` varchar(10) NOT NULL,
	`translationStatus` enum('pending','translated','reviewed','published') NOT NULL DEFAULT 'pending',
	`translationProvider` varchar(50) NOT NULL DEFAULT 'ai',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `translationMetadata_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `articleTranslations` ADD CONSTRAINT `articleTranslations_articleId_articles_id_fk` FOREIGN KEY (`articleId`) REFERENCES `articles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `categoryTranslations` ADD CONSTRAINT `categoryTranslations_categoryId_categories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `languagePreferences` ADD CONSTRAINT `languagePreferences_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;