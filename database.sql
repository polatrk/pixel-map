CREATE TABLE `cells` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pos_x` int NOT NULL,
  `pos_y` int NOT NULL,
  `color` varchar(255) NOT NULL,
  `modified_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `modified_by` (`modified_by`),
  CONSTRAINT `cells_ibfk_1` FOREIGN KEY (`modified_by`) REFERENCES `users` (`id`)
)

CREATE TABLE `drawing_board` (
  `id` int NOT NULL AUTO_INCREMENT,
  `property` varchar(50) NOT NULL,
  `value` text,
  PRIMARY KEY (`id`)
)

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
)