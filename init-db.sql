CREATE TABLE shopping_cart(
	id SERIAL PRIMARY KEY,
	product VARCHAR(40),
	price real,
	quantity SMALLINT
);