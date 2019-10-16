'use strict';

var Transaction = require('dw/system/Transaction');
var OrderMgr = require('dw/order/OrderMgr');

/**
 * Creates a HiPay PaymentInstrument and returns 'success'
 */
function Handle(currentBasket) {
    var basket = currentBasket;
    var paymentMethod = session.forms.billing.paymentMethod.value;
    var HiPayLogger = require('*/cartridge/scripts/lib/hipay/hipayLogger');
    var log = new HiPayLogger('HIPAY_HOSTED');

    if (!empty(paymentMethod)) {
        try {
            var hiPayCheckoutModule = require('*/cartridge/scripts/lib/hipay/modules/hipayCheckoutModule');
            var paymentInstrument = hiPayCheckoutModule.createPaymentInstrument(basket, paymentMethod, true);
            hiPayCheckoutModule.hiPayUpdatePaymentInstrument(paymentInstrument);
        } catch (e) {
            log.error(e);
            return { error: true };
        }

        return { error: false };
    } else { // eslint-disable-line
        return { error: true };
    }
}

/**
 * Authorize HiPay Hosted Page payment
 */
function Authorize(orderNumber, paymentInstrument, paymentProcessor) {
    var paymentMethod = session.forms.billing.paymentMethod.value;
    var orderNo = orderNumber;
    var order = OrderMgr.getOrder(orderNumber);

    if (!empty(paymentMethod)) {
        Transaction.wrap(function () {
            paymentInstrument.paymentTransaction.setTransactionID(orderNo);
            paymentInstrument.paymentTransaction.setPaymentProcessor(paymentProcessor);
        });

        var result = require('*/cartridge/scripts/lib/hipay/modules/hipayCheckoutModule').hiPayHostedPageRequest(order, paymentInstrument);

        if (result.error) {
            return { error: true };
        }

        if (result.hiPayIFrameEnabled) {
            return {
                HiPay: true,
                HiPayRedirectURL: result.hiPayRedirectURL,
                Iframe: true,
                Template: 'hipay/hosted/hipayIframe'
            };
        } else { // eslint-disable-line
            return {
                HiPay: true,
                HiPayRedirectURL: result.hiPayRedirectURL,
                Hosted: true
            };
        }
    } else { // eslint-disable-line
        return { error: true };
    }
}

exports.Handle = Handle;
exports.Authorize = Authorize;
