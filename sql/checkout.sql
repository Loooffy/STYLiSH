create table `checkout`(
    `id` int auto_increment,
    `shipping` varchar(30),
    `payment` varchar(30),
    `subtotal` int,
    `freight` int,
    `total` int,
    `name` varchar(30),
    `phone` varchar(30),
    `email` varchar(30),
    `address` varchar(30),
    `time` varchar(30),
    `paid` boolean,
    primary key(id)
);
