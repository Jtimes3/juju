var notificationController = require('./notificationController');
var sendSMS = require('./sendSMSController');
var sendEmail = require('./sendEmailController');

module.exports=function(router){
router.get('/sms', notificationController.toNotifyGet);
router.post('/sms', sendSMS.sendTextMessage);
// router.get('/email', sendEmail.getAllEmail);
router.post('/email',sendEmail.sendEmailMessage);
//router.put('/api/v1/notifications', notificationController.toNotifyPut);
};