var notificationController = require('./notificationController')
var sendSMS = require('./sendSMSController')
module.exports=function(router){
router.get('/', notificationController.toNotifyGet);
router.post('/', sendSMS.sendTextMessage);
//router.put('/api/v1/notifications', notificationController.toNotifyPut);
};