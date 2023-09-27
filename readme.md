Nette Folder Application
=================

This is an application for working with folders, you can create a tree of folders with unlimited nesting,
as well as add, delete and rename folders. Done using the model Nested Sets.

Sample database
------------

CREATE TABLE `tree` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `deep` int(11) NOT NULL,
  `left` int(11) NOT NULL,
  `right` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `tree` (`id`, `name`, `deep`, `left`, `right`) VALUES
(1,	'root',	0,	1,	10),
(2,	'alco',	1,	2,	7),
(3,	'brandy',	2,	3,	4),
(4,	'whiskey',	2,	5,	6),
(5,	'alcofree',	1,	8,	9);

Requirements
------------

- Web Project for Nette 3.1 requires PHP 8.2