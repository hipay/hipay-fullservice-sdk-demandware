'use strict';

/**
* Auxiliary functions for HiPayNotification Controller
*
* @module cartridge/scripts/lib/hipay/HiPayNotificationModule
*/

function HiPayNotificationModule() {}

/**
 * Extracts parameters from the call made from the HiPay hosted page
 *
 * @param {dw.web.HttpParameterMap} httpParams
 */

HiPayNotificationModule.hiPayProcessNotificationCall = function (httpParams) {
    var params = httpParams;
    var OrderMgr = require('dw/order/OrderMgr');
    var Transaction = require('dw/system/Transaction');
    var HiPayConfig = require('*/cartridge/scripts/lib/hipay/HiPayConfig').HiPayConfig;
    var HiPayLogger = require('*/cartridge/scripts/lib/hipay/HiPayLogger');
    var HiPayHelper = require('*/cartridge/scripts/lib/hipay/HiPayHelper');
    var HiPaySignitureMgr = require('*/cartridge/scripts/lib/hipay/HiPaySignitureMgr').HiPaySignitureMgr;
    var hipayUtils = require('*/cartridge/scripts/lib/hipay/HipayUtils');
    var log = new HiPayLogger('HiPayProcessNotificationCall');
    var helper = new HiPayHelper();
    var shaSignature = request.getHttpHeaders().get('x-allopass-signature');
    var isRequestValid = HiPaySignitureMgr.checkIsValidNotification(request.getHttpParameters(), HiPayConfig.hipayApiPassphrase, shaSignature);

    if (!isRequestValid) {
        log.error('The notification call from HiPay has an invalid signature! ' + params);
        return false;
    }

    log.info('HiPay Notification ' + params);

    var orderid = null;
    var order = null;

    if (params.isParameterSubmitted('order[id]')) {
        orderid = hipayUtils.removeFromOrderId(params['order[id]'].stringValue);

        if (empty(orderid)) {
            log.error('The notification call from HiPay does not have a valid OrderNo!');
            return false;
        } else { // eslint-disable-line
            order = OrderMgr.getOrder(orderid);
            if (empty(order)) {
                log.error('The notification call from HiPay bares an OrderNo which is not valid! :: ' + orderid);
                return false;
            }
        }
    } else {
        log.error('The notification call from HiPay does not have the order[id] parameter!');
        return false;
    }

    Transaction.wrap(function () {
        var paymentInstr = helper.getOrderPaymentInstrument(order);
        helper.updatePaymentStatus(order, paymentInstr, params); // update the payment status
    });

    Transaction.wrap(function () {
        var message = params.message.stringValue;
        helper.addOrderNote(order, 'HiPay Notification - ' + message);
    });

    return true;
};

module.exports = HiPayNotificationModule;
