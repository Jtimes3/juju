var request = require('request');
var cheerio = require('cheerio');

//something for jessica

//scrapes item data from target
var scrape = function(req, response){
  var url = req.body.url;
  var site = url.match(/([A-Z])*www\.([a-z])*\./g);
  site = site[0].slice(4, -1);

  if(scrapeObj[site]){
    scrapeObj[site](req, response)
  } else {
    response.send('not a site')
  }
};

var scrapeObj = {
  amazon: function(req, response){
    var url = req.body.url ;

    request(url, function(error, res , html){
      if(error){
        return 'error in scrape';
      }

      //convert into html into a cheerio object
      var $ = cheerio.load(html);
      var productTitle = $('#productTitle').text();
      var priceDiv = $('#price');
      var productPrice;

      //check if item is onsale
      if(priceDiv.find('#priceblock_dealprice').length) {
        productPrice = priceFilter(priceDiv.find('#priceblock_dealprice').text());
      } else if (priceDiv.find('#priceblock_saleprice').length){
        productPrice =priceFilter($('#priceblock_saleprice').text());
      } else {
        productPrice = priceFilter($('#priceblock_ourprice').text());
      }

      var image = $('#imgTagWrapperId').children('img').attr('src');
      var productObj = {
        productTitle : productTitle,
        price: productPrice,
        picture: image
      };

      //sends scraped data to sender
      response.send(productObj);
    });
  },
  target: function(req, response){
    var url = req.body.url ;

    request(url, function(error, res , html){
      if(error){
        return 'error in scrape';
      }

      //convert html into a cheerio object
      var $ = cheerio.load(html);
      var productTitle = $('.product-name').children('name').text();

      if($('.product-name').children().length){
        var productTitle = $('.fn').text()
      }
      var productPrice = priceFilter($('.offerPrice').text());
      var image = $('#Hero').children('img').attr('src');
      var productObj = {
        productTitle : productTitle,
        price: productPrice,
        picture: image
      };

      //sends scraped data to sender
      response.send(productObj);
    });
  }
};

var priceFilter = function (scrapedPrice) {
  var isRange = scrapedPrice.match(/\$?(\d+,?)+\.?\d+\S - \S\$?(\d+,?)+\.?\d+/g);
  var hasPrice = scrapedPrice.match(/\$?(\d+,?)+\.?\d+/g);
  if(hasPrice){
    return hasPrice[0]
  }

  return 'no price found';
}

module.exports = {
  scrape: scrape,
  scrapeObj: scrapeObj
};
