var request = require('request');
var cheerio = require('cheerio');

//something for jessica

//scrapes item data from target
var scrape = function(req, response){
  // console.log('req inside scrape: ', req.body.url);
  var url = req.body.url;
  console.log('url is ' , url)
  var site = url.match(/([A-Z])*\.([a-z])*\./g);
  site = site[0].slice(1,-1);
  console.log('site is', site)
  if(scrapeObj[site]){
    scrapeObj[site](req, response);
  } else {
    response.send('not a site');
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
        picture: image,
        productUrl: url
      };

      //sends scraped data to sender
      response.send(productObj);
    });
  },
  target: function(req, response){
    var url = req.body.url;

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
        picture: image,
        productUrl: url
      };

      //sends scraped data to sender
      response.send(productObj);
    });
  },
  nordstrom: function (req, response){
        var url = req.body.url ;

    request(url, function(error, res , html){
      if(error){
        return 'error in scrape';
      }

      //convert html into a cheerio object
      var $ = cheerio.load(html);
      var productTitle = $('.product-title').children('h1').text();

      if($('.product-name').children().length){
        var productTitle = $('.fn').text()
      }

      if($('.regular-price').text()){
        var productPrice = priceFilter($('.regular-price').text());
      }else {
        var productPrice = priceFilter($('.price-current').text());
      }
      var image = $('.gallery').children('link').attr('href');
      console.log(image)
      var productObj = {
        productTitle : productTitle,
        price: productPrice,
        picture: image
      };

      //sends scraped data to sender
      response.send(productObj);
    });
  },

  //curl --data 'url=http://www.crateandbarrel.com/adams-bronze-pharmacy-floor-lamp/s611457' http://127.0.0.1:3000/scrape
  //curl --data 'url=http://www.crateandbarrel.com/w%C3%BCsthof-classic-ikon-14-piece-knife-block-set/s532616' http://127.0.0.1:3000/scrape
crateandbarrel : function (req, response) {
    var url = req.body.url;

    request(url, function (err, res, html) {
      if(err){
        return 'error in scrape';
      }
      var $ = cheerio.load(html);
      var productTitle = $('#productNameHeader').text();
      var priceText = $('.salePrice').length === 0 ? $('.regPrice') : $('.salePrice');
      var price = priceText.text();

      var productPrice = priceFilter(price);

      var image = $('.jsZoomLarge').attr('src');

      var productObj = {
        productTitle : productTitle,
        price: productPrice,
        picture: image
      };

      //sends scraped data to sender
      response.send(productObj);

    });
  },

  //curl --data 'url=https://www.ae.com/men-aeo-burnout-pocket-crew-t-shirt-red/web/s-prod/1164_8419_600?cm=sUS-cUSD&catId=cat90012'  http://127.0.0.1:3000/scrape
  ae : function (req, response) {
    var url = req.body.url;

    request(url, function (err, res, html) {
      if(err){
        return 'error in scrape';
      }
      var $ = cheerio.load(html);
      var productTitle = $('.psp-product-name').text();
      var price = $('#psp-regular-price').text();
      var productPrice = priceFilter(price);

      var image = $('.carousel-inner picture').first().attr('data-image');
      if(image[0]==='/'){
        image = image.slice(2);
        image = 'http://'+image;
      }

      var productObj = {
        productTitle : productTitle,
        price: productPrice,
        picture: image
      };

      //sends scraped data to sender
      response.send(productObj);

    });
  } ,

  //curl --data 'url=http://www.disneystore.com/bb-8-app-enabled-droid-by-sphero-star-wars-the-force-awakens/mp/1384851/1000265/'  http://127.0.0.1:3000/scrape


  disneystore : function (req, response) {
    var url = req.body.url;

    request(url, function (err, res, html) {
      if(err){
        return 'error in scrape';
      }
      var $ = cheerio.load(html);
      var productTitle = $('.pageHeader').children('h1').text();
      var price = $('.price').text();
      var productPrice = priceFilter(price);

      var image = $('#imageViewer').children('img').attr('src');

      var productObj = {
        productTitle : productTitle,
        price: productPrice,
        picture: image
      };

      //sends scraped data to sender
      response.send(productObj);

    });
  } ,
      //curl --data 'url=http://www.costco.com/Bose%C2%AE-SoundLink%C2%AE-Mini-Bluetooth-Speaker.product.100222146.html'  http://127.0.0.1:3000/scrape

 //curl --data 'url=http://www.costco.com/.product.100246774.html?'  http://127.0.0.1:3000/scrape

    costco : function (req, response) {
    var url = req.body.url;

    request(url, function (err, res, html) {
      if(err){
        return 'error in scrape';
      }
      var $ = cheerio.load(html);
      var productTitle = $('.top_review_panel').children('h1').text();
      var price = $('.currency').text();
      var productPrice = priceFilter(price);

      var image = $('#large_images').find('img').attr('src');

      var productObj = {
        productTitle : productTitle,
        price: productPrice,
        picture: image
      };

      //sends scraped data to sender
      response.send(productObj);

    });
  },

  //curl --data 'url=http://www.neimanmarcus.com/Naeem-Khan-Sleeveless-Metallic-Embellished-Gown-Gray-Silver-Naeem-Khan/prod186210467_cat55920965__/p.prod?icid=InSite_031416&searchType=EndecaDrivenCat&rte=%252Fcategory.jsp%253FitemId%253Dcat55920965%2526pageSize%253D30%2526Nao%253D0%2526refinements%253D&eItemId=prod186210467&cmCat=product'  http://127.0.0.1:3000/scrape

 //curl --data 'url=http://www.neimanmarcus.com/Loro-Piana-Mia-Panama-Brisa-Hat-Accessories/prod186250206_cat4520740__/p.prod?icid=&searchType=EndecaDrivenCat&rte=%252Fcategory.jsp%253FitemId%253Dcat4520740%2526pageSize%253D30%2526No%253D0%2526refinements%253D&eItemId=prod186250206&cmCat=product&childItemId=NMD15E2_11'  http://127.0.0.1:3000/scrape

  neimanmarcus : function (req, response) {
    var url = req.body.url;

    request(url, function (err, res, html) {
      if(err){
        return 'error in scrape';
      }
      var $ = cheerio.load(html);
      // var productTitle = $('.productDetails').find('span').text();
      var productTitle = $('title').text();
      var price = $('.lbl_ItemPriceSingleItem').text();
      var productPrice = priceFilter(price);

      var image = $('.img-wrap').find('img').attr('src');
      if(image[0]==='/'){
        image = image.slice(2);
        image = 'http://'+image;
      }

      var productObj = {
        productTitle : productTitle,
        price: productPrice,
        picture: image
      };

      //sends scraped data to sender
      response.send(productObj);

    });
  },
    //curl --data 'url=http://www.barnesandnoble.com/w/harry-potter-and-the-cursed-child-parts-i-ii-j-k-rowling/1123463689?ean=9781338099133'  http://127.0.0.1:3000/scrape

 //curl --data 'url=http://www.barnesandnoble.com/w/lion-the-witch-and-the-wardrobe-c-s-lewis/1100182094?ean=9780064471046'  http://127.0.0.1:3000/scrape

  barnesandnoble : function (req, response) {
    var url = req.body.url;

    request(url, function (err, res, html) {
      if(err){
        return 'error in scrape';
      }
      var $ = cheerio.load(html);
      var productTitle = $('#prodSummary').find('h1').text();
      var price = $('.price').text();
      var productPrice = priceFilter(price);

      var image = $('.prim-image').find('img').attr('src');
      if(image[0]==='/'){
        image = image.slice(2);
        image = 'http://'+image;
      }

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
