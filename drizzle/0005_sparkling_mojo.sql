CREATE TABLE `partnerships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`partnerName` varchar(255) NOT NULL,
	`partnerLogo` varchar(500) NOT NULL,
	`partnerUrl` varchar(500),
	`description` varchar(500),
	`isActive` boolean DEFAULT true,
	`order` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partnerships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`authorName` varchar(255) NOT NULL,
	`authorTitle` varchar(255),
	`authorImage` varchar(500),
	`content` text NOT NULL,
	`rating` int DEFAULT 5,
	`isActive` boolean DEFAULT true,
	`order` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
