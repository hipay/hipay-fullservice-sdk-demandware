'use strict';

var base = module.superModule;

var URLUtils = require('dw/web/URLUtils');

/**
 * Creates a plain object that contains payment instrument information
 * @param {Object} userPaymentInstruments - current customer's paymentInstruments
 * @returns {Object} object that contains info about the current customer's payment instruments
 */
function getCustomerPaymentInstruments(userPaymentInstruments) {
    var paymentInstruments;
    var sitePrefs = require('dw/system/Site').getCurrent().getPreferences().getCustom();

    userPaymentInstruments = userPaymentInstruments.filter(function (paymentInstrument) { // eslint-disable-line no-param-reassign
        if (sitePrefs.hipayEnabled && sitePrefs.hipayEnableOneClick) {
            return paymentInstrument.raw.paymentMethod.indexOf('HIPAY') > -1;
        } else { // eslint-disable-line
            return paymentInstrument.raw.paymentMethod.indexOf('HIPAY') < 0;
        }
    });

    paymentInstruments = userPaymentInstruments.map(function (paymentInstrument) {
        var result = {
            creditCardHolder: paymentInstrument.creditCardHolder,
            maskedCreditCardNumber: paymentInstrument.maskedCreditCardNumber,
            creditCardType: paymentInstrument.creditCardType,
            creditCardExpirationMonth: paymentInstrument.creditCardExpirationMonth,
            creditCardExpirationYear: paymentInstrument.creditCardExpirationYear,
            UUID: paymentInstrument.UUID
        };

        result.cardTypeImage = {
            src: URLUtils.staticURL('/images/' +
                paymentInstrument.creditCardType.toLowerCase().replace(/\s/g, '') +
                '-dark.svg'),
            alt: paymentInstrument.creditCardType
        };

        return result;
    });

    return paymentInstruments;
}

/**
 * Account class that represents the current customer's profile dashboard
 * @param {dw.customer.Customer} currentCustomer - Current customer
 * @param {Object} addressModel - The current customer's preferred address
 * @param {Object} orderModel - The current customer's order history
 * @constructor
 */
function account(currentCustomer, addressModel, orderModel) {
    base.call(this, currentCustomer, addressModel, orderModel);

    this.customerPaymentInstruments = currentCustomer.wallet
        && currentCustomer.wallet.paymentInstruments
        ? getCustomerPaymentInstruments(currentCustomer.wallet.paymentInstruments)
        : null;
}

account.getCustomerPaymentInstruments = getCustomerPaymentInstruments;

module.exports = account;
