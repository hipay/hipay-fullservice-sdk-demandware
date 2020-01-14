'use strict';

var base = module.superModule;

var PaymentMgr = require('dw/order/PaymentMgr');
var collections = require('*/cartridge/scripts/util/collections');

function getSelectedPaymentInstruments(selectedPaymentInstruments) {
    return collections.map(selectedPaymentInstruments, function (paymentInstrument) {
        var selectedPaymentMethod = PaymentMgr.getPaymentMethod(paymentInstrument.paymentMethod);

        var results = {
            paymentMethod: paymentInstrument.paymentMethod,
            amount: paymentInstrument.paymentTransaction.amount.value,
            name: selectedPaymentMethod.name
        };
        if (paymentInstrument.paymentMethod.indexOf('CREDIT_CARD') > -1 || paymentInstrument.paymentMethod.indexOf('HIPAY_CREDIT_CARD') > -1) {
            results.lastFour = paymentInstrument.creditCardNumberLastDigits;
            results.owner = paymentInstrument.creditCardHolder;
            results.expirationYear = paymentInstrument.creditCardExpirationYear;
            results.type = paymentInstrument.creditCardType;
            results.maskedCreditCardNumber = paymentInstrument.maskedCreditCardNumber;
            results.expirationMonth = paymentInstrument.creditCardExpirationMonth;
        } else if (paymentInstrument.paymentMethod === 'GIFT_CERTIFICATE') {
            results.giftCertificateCode = paymentInstrument.giftCertificateCode;
            results.maskedGiftCertificateCode = paymentInstrument.maskedGiftCertificateCode;
        }

        return results;
    });
}

function Payment(currentBasket, currentCustomer, countryCode) {
    var paymentInstruments = currentBasket.paymentInstruments;

    base.call(this, currentBasket, currentCustomer, countryCode);

    this.selectedPaymentInstruments = paymentInstruments ?
            getSelectedPaymentInstruments(paymentInstruments) : null;
}

Payment.prototype = Object.create(base.prototype);

module.exports = Payment;
