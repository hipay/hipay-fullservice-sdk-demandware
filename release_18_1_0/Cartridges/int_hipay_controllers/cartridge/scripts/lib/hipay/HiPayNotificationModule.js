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

HiPayNotificationModule.hiPayProcessNotificationCall = function(httpParams) {
    var params                   = httpParams,
        OrderMgr                 = require('dw/order/OrderMgr'),
        HiPayConfig              = require('~/cartridge/scripts/lib/hipay/HiPayConfig').HiPayConfig,
        HiPayLogger              = require("~/cartridge/scripts/lib/hipay/HiPayLogger"),
        HiPayHelper              = require("~/cartridge/scripts/lib/hipay/HiPayHelper"),
        HiPaySignitureMgr        = require('~/cartridge/scripts/lib/hipay/HiPaySignitureMgr').HiPaySignitureMgr,
        log                      = new HiPayLogger("HiPayProcessNotificationCall"),
        helper                   = new HiPayHelper(),
        shaSignature             = request.getHttpHeaders().get('x-allopass-signature'),
        isRequestValid           = HiPaySignitureMgr.checkIsValidNotification(request.getHttpParameters(), HiPayConfig.hipayApiPassphrase, shaSignature);

    if (!isRequestValid) {
        log.error("The notification call from HiPay has an invalid signature!\n" + params);
        return false;
    }

    log.info("HiPay Notification \n" + params);

    var orderid = null;
    var order   = null;

    if (params.isParameterSubmitted("order[id]")) {
        var orderid = params["order[id]"].stringValue; //=00000601

        if (empty(orderid)) {
            log.error("The notification call from HiPay does not have a valid OrderNo!");
            return false;
        } else {
            order = OrderMgr.getOrder(orderid);
            if (empty(order)) {
                log.error("The notification call from HiPay bares an OrderNo which is not valid! :: " + orderid);
                return false;
            }
        }
    } else {
        log.error("The notification call from HiPay does not have the order[id] parameter!");
        return false;
    }

    dw.system.Transaction.wrap(function() {
        var paymentInstr = helper.getOrderPaymentInstrument(order);
        helper.updatePaymentStatus(order, paymentInstr, params); //update the payment status
    });

    dw.system.Transaction.wrap(function() {
        var message = params.message.stringValue;
        helper.addOrderNote(order, "HiPay Notification - " + message);
    });

    return true;
}

module.exports = HiPayNotificationModule;
