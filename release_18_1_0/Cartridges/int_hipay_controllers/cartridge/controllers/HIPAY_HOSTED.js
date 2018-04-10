'use strict';

/**
* HIPAY_HOSTED.js
*
* @module  controllers/HIPAY_HOSTED
*/

/* API Includes */
var PaymentMgr  = require('dw/order/PaymentMgr'),
    Transaction = require('dw/system/Transaction'),
    ISML        = require('dw/template/ISML');

/* Creates a HiPay PaymentInstrument and returns 'success'.*/
function Handle(args) {
    var basket        = args.Basket,
        paymentMethod = session.forms.billing.paymentMethods.selectedPaymentMethodID.value,
        HiPayLogger   = require("~/cartridge/scripts/lib/hipay/HiPayLogger"),
        log           = new HiPayLogger("HIPAY_HOSTED");

    if (!empty(paymentMethod)) {
        try {
            var hiPayCheckoutModule = require('~/cartridge/scripts/lib/hipay/HiPayCheckoutModule'),
                paymentInstrument   = hiPayCheckoutModule.createPaymentInstrument(basket, paymentMethod, true);
            hiPayCheckoutModule.hiPayUpdatePaymentInstrument(paymentInstrument);

        } catch (e) {
            log.error(e);
            return { error : true };
        }

        return { success : true };
    } else {
        return { error : true };
    }
}

/* Authorize HiPay Hosted Page payment */
function Authorize(args) {
    var paymentMethod     = session.forms.billing.paymentMethods.selectedPaymentMethodID.value,
        orderNo           = args.OrderNo,
        paymentInstrument = args.PaymentInstrument,
        order             = args.Order,
        HiPayLogger       = require("~/cartridge/scripts/lib/hipay/HiPayLogger"),
        log               = new HiPayLogger("HIPAY_HOSTED");

    if (!empty(paymentMethod)) {
        var paymentProcessor = PaymentMgr.getPaymentMethod(paymentMethod).getPaymentProcessor();

        Transaction.wrap(function () {
            paymentInstrument.paymentTransaction.transactionID    = orderNo;
            paymentInstrument.paymentTransaction.paymentProcessor = paymentProcessor;
        });

        var result = require('~/cartridge/scripts/lib/hipay/HiPayCheckoutModule').hiPayHostedPageRequest(order, paymentInstrument);

        if (result.error) {
            return { error : true };
        }

        if (result.hiPayIFrameEnabled) {
            ISML.renderTemplate('hipay/hosted/hipayiframe', {
                HiPayRedirectURL : result.hiPayRedirectURL
            });
        } else {
            ISML.renderTemplate('hipay/hosted/hipayredirect', {
                HiPayRedirectURL : result.hiPayRedirectURL
            });
        }

        return { success : true };
    } else {
        return { error : true };
    }
}

exports.Handle = Handle;

exports.Authorize = Authorize;
