DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id SERIAL PRIMARY KEY, 
  email VARCHAR(50) UNIQUE,
  phoneNumber VARCHAR(13),
  contactPref VARCHAR(15),
  FBuID VARCHAR(255) UNIQUE,
  FBname VARCHAR(255)
);


DROP TABLE IF EXISTS items CASCADE;

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  productTitle VARCHAR(255),
  itemUrl VARCHAR(500) UNIQUE,
  itemImageUrl VARCHAR(500),
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
  nickName VARCHAR(8),
  idealPrice MONEY,
  settlePrice MONEY,
  priceReached BOOLEAN,
  contacted BOOLEAN,
  itemID INTEGER,
  userID INTEGER,
  category VARCHAR(250),
  FOREIGN KEY (itemID) REFERENCES items(id),
  FOREIGN KEY (userID) REFERENCES users(id)
);