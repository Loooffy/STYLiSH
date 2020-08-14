create table `order`(
    `checkout_id` int,
    `product_id` int,
    `color_code` varchar(30),
    `size` varchar(30),
    `quantity` int,
    primary key(checkout_id, product_id, color_code, size),
    foreign key (checkout_id) references `checkout` (id) 
);
