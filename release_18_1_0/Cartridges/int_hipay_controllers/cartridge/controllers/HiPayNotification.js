'use strict';

/**
* HiPayNotification.js
*
* @module  controllers/HiPayNotification
*/

/* API includes */
var ISML  = require('dw/template/ISML'),
    guard = require('~/cartridge/scripts/guard');

/* Handles HiPay server notifications */
function notify() {
    var httpParams = request.httpParameterMap;
    require('~/cartridge/scripts/lib/hipay/HiPayNotificationModule').hiPayProcessNotificationCall(httpParams);
    ISML.renderTemplate('hipay/notifications/hipaynotification');
}

/** @see {@link module:controllers/HiPayNotification~notify} */
exports.Notify = guard.ensure(['post'], notify);
