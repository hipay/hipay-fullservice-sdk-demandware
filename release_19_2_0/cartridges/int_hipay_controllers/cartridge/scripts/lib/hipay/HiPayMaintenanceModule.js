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

HiPayMaintenanceModule.hiPayMaintenanceRequest = function (order, amount) {
    var Transaction = require('dw/system/Transaction');
    var Decimal = require('dw/util/Decimal');
    return Transaction.wrap(function () {
        var HiPayMaintenanceService = require('*/cartridge/scripts/lib/hipay/services/HiPayMaintenanceService');
        var HiPayLogger = require('*/cartridge/scripts/lib/hipay/HiPayLogger');
        var HiPayHelper = require('*/cartridge/scripts/lib/hipay/HiPayHelper');
        var log = new HiPayLogger('HiPayMaintenanceRequest');
        var helper = new HiPayHelper();
        var hiPayMaintenanceService = new HiPayMaintenanceService();
        var amountToCapture = amount;
        var regEx = /^[+]?([.]\d+|\d+[.]?\d*)$/; // Validate for positive number
        var response = {
            hiPayMaintenanceResponse: null,
            error: true
        };

        if (!amountToCapture.match(regEx)) {
            log.error('Calling HiPayMaintenance Capture ::: Wrong Capture amount value!');
            response.error = true;

            return response;
        }

        var paymentInstr = helper.getOrderPaymentInstrument(order);
        var transactionReference = paymentInstr.getPaymentTransaction().getTransactionID();
        var captureRequestAmount = 0;

        if ('hipayTransactionCaptureRequestAmount' in paymentInstr.custom) {
            captureRequestAmount = paymentInstr.custom.hipayTransactionCaptureRequestAmount;
        }

        var orderTotal = 0;

        if (order.totalGrossPrice.available) {
            orderTotal = order.totalGrossPrice.decimalValue;
        } else {
            orderTotal = order.getAdjustedMerchandizeTotalPrice(true).add(order.giftCertificateTotalPrice).decimalValue;
        }

        var captureDiff = orderTotal - captureRequestAmount;
        var roundedDiff = new Decimal(captureDiff).round(2);

        if (roundedDiff < amountToCapture) {
            log.error('Calling HiPayMaintenance Capture ::: The Capture amount is higher than the avilable total amount!');
            response.error = true;

            return response;
        }

        try {
            log.debug('Calling HiPayMaintenance Capture ::: ' + transactionReference);

            if (empty(transactionReference)) {
                log.error('HiPay maintenance service ::: Missing transaction Reference');
                response.error = true;

                return response;
            }

            var serviceAmount = amountToCapture;

            if (amountToCapture === orderTotal) {
                serviceAmount = '';
            }

            var hipayResponse = hiPayMaintenanceService.initiateCapture(transactionReference, HiPayMaintenanceService.OPERATION_CAPTURE, serviceAmount);
            var msg = null;

            if (hipayResponse.ok === true) {
                msg = JSON.parse(hipayResponse.object.text);

                paymentInstr.custom.hipayTransactionCaptureRequestAmount = +captureRequestAmount + +amountToCapture; // update capture amount

                log.debug('HiPay Hosted Page Response ::: ' + JSON.stringify(msg, undefined, 2));
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
};

module.exports = HiPayMaintenanceModule;
