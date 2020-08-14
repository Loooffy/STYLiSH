CREATE TABLE `product` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `title` varchar(255),
  `description` varchar(255),
  `price` int,
  `texture` varchar(255),
  `wash` varchar(255),
  `place` varchar(255),
  `note` varchar(255),
  `story` varchar(255),
  `category` varchar(255),
  `main_image` varchar(255)
);

CREATE TABLE `product_images` (
  `product_id` int,
  `image` varchar(255),
  PRIMARY KEY (`image`)
);

CREATE TABLE `stock` (
  `product_id` int PRIMARY KEY,
  `color` varchar(255),
  `size` int,
  `stock` int
);

CREATE TABLE `users` (
  `id` int PRIMARY KEY,
  `name` varchar(255),
  `email` varchar(255),
  `picture` varchar(255)
);

CREATE TABLE `campaign` (
  `id` int,
  `product_id` int,
  `story` varchar(255),
  `image` varchar(255),
  PRIMARY KEY (`id`, `product_id`)
);

CREATE TABLE `hots_title` (
  `hots_id` int PRIMARY KEY,
  `title` varchar(255)
);

CREATE TABLE `hots` (
  `id` int,
  `product_id` int,
  `title` varchar(255),
  PRIMARY KEY (`id`, `product_id`)
);

ALTER TABLE `stock` ADD FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

ALTER TABLE `campaign` ADD FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

ALTER TABLE `hots` ADD FOREIGN KEY (`id`) REFERENCES `product` (`id`);

ALTER TABLE `hots_title` ADD FOREIGN KEY (`hots_id`) REFERENCES `hots` (`id`);

ALTER TABLE `product_images` ADD FOREIGN KEY (`product_id`) REFERENCES `product` (`id`);

