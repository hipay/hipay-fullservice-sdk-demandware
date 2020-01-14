'use strict';

var server = require('server');

/**
 *  Handles HiPay server notifications
 */
server.post(
    'Notify',
    server.middleware.https,
    function (req, res, next) {
        var httpParams = request.httpParameterMap;

        require('*/cartridge/scripts/lib/hipay/modules/hipayNotificationModule').hiPayProcessNotificationCall(httpParams);
        res.render('hipay/notifications/hipayNotification');

        return next();
    }
);

module.exports = server.exports();
