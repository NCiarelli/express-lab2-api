CREATE TABLE shopping_cart(
	id SERIAL PRIMARY KEY,
	product VARCHAR(40),
	price real,
	quantity SMALLINT
);
INSERT INTO shopping_cart (product, price, quantity)
VALUES ('bananas', 0.49, 3),
('celery', 1.33, 2),
('apples', 1.39, 3),
('bread', 1.25, 2);