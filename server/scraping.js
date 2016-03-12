var request = require('request');
var cheerio = require('cheerio');

//scrapes item data from amazon
var scrape = function (req,response){

  var url = req.body.url ;

  request(url,  function(error, res , html){

    if(error){
      console.log('Error in scrape request');
      return 'error in scrape';
    }
    //convert into html into a cheerio object
    var $ = cheerio.load(html);

    var productTitle = $('#productTitle').text();
    var priceDiv = $('#price');
    var productPrice;

    //check if item is onsale
    if(priceDiv.find('#priceblock_dealprice').length) {
      productPrice = priceDiv.find('#priceblock_dealprice').text();
    } else if (priceDiv.find('#priceblock_saleprice').length){
      productPrice =$('#priceblock_saleprice').text();
    } else {
      productPrice = $('#priceblock_ourprice').text();
    }

    var image = $('#imgTagWrapperId').children('img').attr('src');

    var productObj = {Name : productTitle, price: productPrice, picture: image };

    //sends scraped data to sender
    response.send(productObj);
  });
};

module.exports = {scrape: scrape};
