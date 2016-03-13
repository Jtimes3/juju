DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id SERIAL PRIMARY KEY, 
  email VARCHAR(50) UNIQUE,
  phoneNumber VARCHAR(13),
  FBuID VARCHAR(250) UNIQUE,
  userName VARCHAR(250)
);


DROP TABLE IF EXISTS items CASCADE;

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  itemUrl VARCHAR(250) UNIQUE,
  itemImageUrl VARCHAR(250),
  currentPrice MONEY
);


DROP TABLE IF EXISTS itemHistories CASCADE;

CREATE TABLE itemHistories (
  id SERIAL PRIMARY KEY,
  price MONEY,
  checkDate DATE,
  itemID INTEGER,
  FOREIGN KEY (itemID) REFERENCES items(id)
);

DROP TABLE IF EXISTS watchedItems CASCADE;

CREATE TABLE watchedItems (
  id SERIAL PRIMARY KEY,
  deadline DATE,
  idealPrice MONEY,
  settlePrice MONEY,
  priceReached BOOLEAN,
  emailed BOOLEAN,
  itemID INTEGER,
  userID INTEGER,
  FOREIGN KEY (itemID) REFERENCES items(id),
  FOREIGN KEY (userID) REFERENCES users(id)
);