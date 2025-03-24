CREATE TABLE `users` (
	`id` VARCHAR(255) NOT NULL UNIQUE,
	`username` VARCHAR(255) NOT NULL UNIQUE,
	`email` VARCHAR(255) NOT NULL UNIQUE,
	`password` VARCHAR(255) NOT NULL,
	`img_url` VARCHAR(255),
	`vip` BIT DEFAULT 0,
	`active` BIT DEFAULT 0,
	`role_id` VARCHAR(255) NOT NULL,
	`balance` DOUBLE NOT NULL,
	`last_topup` TIMESTAMP NOT NULL,
	`level_id` VARCHAR(255) NOT NULL,
	`current_exp` DOUBLE,
	`created_at` TIMESTAMP,
	`updated_at` TIMESTAMP,
	PRIMARY KEY(`id`)
);


CREATE TABLE `comics` (
	`id` VARCHAR(255) NOT NULL UNIQUE,
	`name` VARCHAR(255) NOT NULL,
	`slug` VARCHAR(255) NOT NULL UNIQUE,
	`origin_name` VARCHAR(255),
	`thumb_url` VARCHAR(255),
	`status` VARCHAR(255) DEFAULT 'ongoing',
	`followers_count` INTEGER NOT NULL DEFAULT 0,
	`views_count` INTEGER NOT NULL DEFAULT 0,
	`description` TEXT(65535),
	`rating` TINYINT NOT NULL,
	`created_at` TIMESTAMP,
	`updated_at` TIMESTAMP,
	PRIMARY KEY(`id`)
);


CREATE TABLE `categories` (
	`id` VARCHAR(255) NOT NULL UNIQUE,
	`name` VARCHAR(255) NOT NULL,
	`slug` VARCHAR(255) NOT NULL UNIQUE,
	PRIMARY KEY(`id`)
);


CREATE TABLE `comic_categories` (
	`comic_id` VARCHAR(255) NOT NULL,
	`category_id` VARCHAR(255) NOT NULL,
	PRIMARY KEY(`comic_id`, `category_id`)
);


CREATE TABLE `chapters` (
	`id` VARCHAR(255) NOT NULL UNIQUE,
	`comic_id` VARCHAR(255) NOT NULL,
	`title` VARCHAR(255) NOT NULL,
	`status` ENUM('fee', 'free', 'vip') NOT NULL DEFAULT 'fee',
	`number` INTEGER NOT NULL,
	`created_at` TIMESTAMP,
	`updated_at` TIMESTAMP,
	PRIMARY KEY(`id`)
);


CREATE INDEX `chapters_index_0`
ON `chapters` (`comic_id`);
CREATE TABLE `detail_chapters` (
	`id` VARCHAR(255) NOT NULL UNIQUE,
	`chapter_id` VARCHAR(255) NOT NULL,
	`img_url` VARCHAR(255) NOT NULL,
	`order_number` SMALLINT NOT NULL,
	PRIMARY KEY(`id`, `chapter_id`)
);


CREATE TABLE `comments` (
	`id` VARCHAR(255) NOT NULL UNIQUE,
	`user_id` VARCHAR(255) NOT NULL,
	`chapter_id` VARCHAR(255) NOT NULL,
	`content` TEXT(65535) NOT NULL,
	`status` ENUM('active', 'inactive', 'deleted') NOT NULL DEFAULT 'active',
	`created_at` TIMESTAMP,
	`updated_at` TIMESTAMP,
	PRIMARY KEY(`id`)
);


CREATE TABLE `favorites` (
	`id` VARCHAR(255) NOT NULL UNIQUE,
	`user_id` VARCHAR(255) NOT NULL,
	`comic_id` VARCHAR(255) NOT NULL,
	`created_at` TIMESTAMP,
	PRIMARY KEY(`id`)
);


CREATE TABLE `roles` (
	`id` VARCHAR(255) NOT NULL UNIQUE,
	`name` VARCHAR(255) NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE TABLE `permissions` (
	`id` VARCHAR(255) NOT NULL UNIQUE,
	`role_id` VARCHAR(255) NOT NULL,
	`permission` VARCHAR(255),
	PRIMARY KEY(`id`)
);


CREATE TABLE `publishers` (
	`id` VARCHAR(255) NOT NULL UNIQUE,
	`user_id` VARCHAR(255) NOT NULL,
	`status` ENUM('pending', 'approved', 'rejected'),
	PRIMARY KEY(`id`)
);


CREATE TABLE `topups` (
	`id` VARCHAR(255) NOT NULL UNIQUE,
	`user_id` VARCHAR(255) NOT NULL,
	`amount` DOUBLE NOT NULL,
	`status` ENUM('success', 'pending', 'failed'),
	`created_at` TIMESTAMP NOT NULL,
	PRIMARY KEY(`id`)
);


CREATE TABLE `user_purchased_chapters` (
	`id` VARCHAR(255) NOT NULL UNIQUE,
	`user_id` VARCHAR(255) NOT NULL,
	`chapter_id` VARCHAR(255) NOT NULL,
	`amount` DOUBLE,
	`created_at` TIMESTAMP,
	PRIMARY KEY(`id`)
);


CREATE TABLE `levels` (
	`id` VARCHAR(255) NOT NULL UNIQUE,
	`name` VARCHAR(255) NOT NULL,
	`exp_required` DOUBLE NOT NULL,
	`created_at` TIMESTAMP,
	`updated_at` TIMESTAMP,
	PRIMARY KEY(`id`)
);


ALTER TABLE `comic_categories`
ADD FOREIGN KEY(`comic_id`) REFERENCES `comics`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `comic_categories`
ADD FOREIGN KEY(`category_id`) REFERENCES `categories`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `chapters`
ADD FOREIGN KEY(`comic_id`) REFERENCES `comics`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `detail_chapters`
ADD FOREIGN KEY(`chapter_id`) REFERENCES `chapters`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `comments`
ADD FOREIGN KEY(`user_id`) REFERENCES `users`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `comments`
ADD FOREIGN KEY(`chapter_id`) REFERENCES `chapters`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `favorites`
ADD FOREIGN KEY(`user_id`) REFERENCES `users`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `favorites`
ADD FOREIGN KEY(`comic_id`) REFERENCES `comics`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `users`
ADD FOREIGN KEY(`role_id`) REFERENCES `roles`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `permissions`
ADD FOREIGN KEY(`role_id`) REFERENCES `roles`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `publishers`
ADD FOREIGN KEY(`user_id`) REFERENCES `users`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `topups`
ADD FOREIGN KEY(`user_id`) REFERENCES `users`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `users`
ADD FOREIGN KEY(`level_id`) REFERENCES `levels`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `user_purchased_chapters`
ADD FOREIGN KEY(`user_id`) REFERENCES `users`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `user_purchased_chapters`
ADD FOREIGN KEY(`chapter_id`) REFERENCES `chapters`(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;