require('dotenv').config();

// Your accountSid and authToken from twilio.com/user/account
//sudo npm install -g twilio
//change stuff in the node modules twilio client file in order to make shit work.... probs not ideal...gotta figure out the env file thing

var client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


//var req={body: {}};

module.exports = {
  sendTextMessage : function (req, res){
    //console.log('sendtextmessage req: ', req);
    var itemNickname= req.nickname || 'oops';
    var currentPrice = req.currentprice || 'oops';
    var itemUrl = req.itemurl || 'oops';
    var phoneNumber=req.phonenumber;
    var message='Hello from Saja!\nThis is a notification that the item you were watching (' + itemNickname + ') is currently ' + currentPrice + ' which is equal to or less than the price you were interested in paying. \nYou can find the item at \n' +itemUrl +'\n Enjoy!' // The body of the text message

    //var client = require('twilio')('AC420b878efbf51bb91fb5260ecef6b3b1', '759b77f8c566b9efdf37f7cd786d3bdc');
    client.sendMessage({
        to: phoneNumber, // the number for the phone in your pocket
        from:'+16513832409', // your Twilio number
        body: message // The body of the text message
    }, function(error, message) {
        // This callback is executed when the request completes
        if (error) {
            console.error('**TextErr', error);
        } else {
            console.log('**TextMessage sent! Message id: '+message.sid);
            //res.send(message);
        }
    });
  }

};