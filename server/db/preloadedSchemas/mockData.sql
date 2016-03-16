/*
  #########
  # USERS #
  #########
*/

INSERT INTO users (email,phoneNumber, contactPref, FBuID,FBname) VALUES ('james@gmail.com', '949-466-4483', 'email', 'poop', 'hyoun44');
INSERT INTO users (email,phoneNumber, contactPref, FBuID,FBname) VALUES ('joe@gmail.com', '555-555-5555', 'text', 'peep', 'chiral');


/*
  #########
  # ITEMS #
  #########
*/
INSERT INTO items (productTitle,itemUrl,itemImageUrl,currentPrice)
VALUES (
  'light',
  'http://www.amazon.com/gp/product/B00LXTP2FA/ref=s9_simh_gw_g468_i1_r?ie=UTF8&fpl=fresh&pf_rd_m=ATVPDKIKX0DER&pf_rd_s=desktop-1&pf_rd_r=1AP11P4BPYNJ3KJ17WJ4&pf_rd_t=36701&pf_rd_p=2079475242&pf_rd_i=desktop',
  'http://ecx.images-amazon.com/images/I/71mKsMqkvvL._SX425_.jpg',
  '$5.00'
);

INSERT INTO items (productTitle,itemUrl,itemImageUrl,currentPrice)
VALUES (
  'light',
  'http://www.amazon.com/Torero-Inflatables-Dancer-Complete-20-Feet/dp/B00ASSF6MQ/ref=sr_1_1?s=sporting-goods&ie=UTF8&qid=1457732654&sr=1-1&keywords=air+dancer',
  'http://ecx.images-amazon.com/images/I/81QatMHsj-L._SY355_.jpg',
  '$200.00'
);


/*
  ##################
  # ITEM HISTORIES #
  ##################
*/

/* Item #1 */
INSERT INTO itemHistories (price,checkDate,itemID) VALUES ('$10.08', '2016-03-08', 1);
INSERT INTO itemHistories (price,checkdate,itemID) VALUES ('$21.56', '2016-03-11', 1);
INSERT INTO itemHistories (price,checkdate,itemID) VALUES ('$53.11', '2016-03-10', 1);

/* Item #2 */
INSERT INTO itemHistories (price,checkdate,itemID) VALUES ('$300.11', '2016-03-10', 2);
INSERT INTO itemHistories (price,checkdate,itemID) VALUES ('$250.11', '2016-03-10', 2);


/*
  #################
  # WATCHED ITEMS #
  #################
*/

/* User #1 */
INSERT INTO watchedItems (deadline, nickName, idealPrice,settlePrice,priceReached,emailed,itemID,userID)
VALUES ('2016-04-01', 'shoes (with poop for james)', '$15.00', '$19.98', false, false, 1, 1);

INSERT INTO watchedItems (deadline, nickName, idealPrice,settlePrice,priceReached,emailed,itemID,userID)
VALUES ('2016-04-01', 'poopShirt', '$12.99', '$17.22', true, false, 2, 1);

/* User #2 */
INSERT INTO watchedItems (deadline, nickName, idealPrice,settlePrice,priceReached,emailed,itemID,userID)
VALUES ('2016-04-01', 'candyBar', '$12.99', '$17.22', true, true, 2, 2);

