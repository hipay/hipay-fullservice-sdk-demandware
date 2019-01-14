'use strict';

/**
* Auxiliary functions of the HiPay integration cartridge
*
* @module cartridge/scripts/lib/hipay/HiPayMaintenanceModule
*/

var HiPayMaintenanceModule = function () {};

/**
 * Initiates HiPay maintenance call as builds all the request parameters.
 *
 * @param {Object} amount
 * @param {dw.order.Order} order
 *
 * @returns {Object}  response
 *          {Boolean} response.error
 *          {String}  response.hiPayMaintenanceResponse
 */

HiPayMaintenanceModule.hiPayMaintenanceRequest = function(order, amount) {
    return dw.system.Transaction.wrap(function() {
        var dwOrder                 = require('dw/order'),
            HiPayMaintenanceService = require("~/cartridge/scripts/lib/hipay/services/HiPayMaintenanceService"),
            HiPayLogger             = require("~/cartridge/scripts/lib/hipay/HiPayLogger"),
            HiPayHelper             = require("~/cartridge/scripts/lib/hipay/HiPayHelper"),
            log                     = new HiPayLogger("HiPayMaintenanceRequest"),
            helper                  = new HiPayHelper(),
            hiPayMaintenanceService = new HiPayMaintenanceService(),
            amountToCapture         = amount,
            regEx                   = /^[+]?([.]\d+|\d+[.]?\d*)$/, /* Validate for positive number */
            response                = {
                hiPayMaintenanceResponse : null,
                error                    : true
            };

        if (!amountToCapture.match(regEx)) {
            log.error("Calling HiPayMaintenance Capture ::: \n Wrong Capture amount value!");
            response.error = true;
            return response;
        }

        var paymentInstr         = helper.getOrderPaymentInstrument(order),
            transactionReference = paymentInstr.getPaymentTransaction().getTransactionID(),
            captureRequestAmount = 0;

        if ("hipayTransactionCaptureRequestAmount" in paymentInstr.custom) {
            captureRequestAmount = paymentInstr.custom.hipayTransactionCaptureRequestAmount;
        }

        var orderTotal = 0;

        if (order.totalGrossPrice.available) {
            orderTotal = order.totalGrossPrice.decimalValue;
        } else {
            orderTotal = order.getAdjustedMerchandizeTotalPrice(true).add(LineItemCtnr.giftCertificateTotalPrice).decimalValue;
        }

        var captureDiff = orderTotal - captureRequestAmount,
            roundedDiff = new dw.util.Decimal(captureDiff).round(2);

        if (roundedDiff < amountToCapture) {
            log.error("Calling HiPayMaintenance Capture ::: \n The Capture amount is higher than the avilable total amount!");
            response.error = true;
            return response;
        }

        try {
            log.debug("Calling HiPayMaintenance Capture ::: \n" + transactionReference);

            if (empty(transactionReference)) {
                log.error("HiPay maintenance service ::: Missing transaction Reference");
                response.error = true;
                return response;
            }

            var serviceAmount = amountToCapture;

            if (amountToCapture == orderTotal) {
                serviceAmount = '';
            }

            var hipayResponse = hiPayMaintenanceService.initiateCapture(transactionReference, HiPayMaintenanceService.OPERATION_CAPTURE, serviceAmount),
                msg           = null;

            if (hipayResponse.ok === true) {
                msg = JSON.parse(hipayResponse.object.text);

                paymentInstr.custom.hipayTransactionCaptureRequestAmount = +captureRequestAmount + +amountToCapture; /* update capture amount */

                log.debug("HiPay Hosted Page Response ::: \n" + JSON.stringify(msg, undefined, 2));
            } else {
                log.error(hipayResponse.msg);
                response.error = true;
                return response;
            }

            response.hiPayMaintenanceResponse = JSON.stringify(msg, undefined, 2);
        } catch (e) {
            log.error(e);
            response.error = true;
            return response;
        }

        response.error = false;
        return response;
    });
}

module.exports = HiPayMaintenanceModule;
