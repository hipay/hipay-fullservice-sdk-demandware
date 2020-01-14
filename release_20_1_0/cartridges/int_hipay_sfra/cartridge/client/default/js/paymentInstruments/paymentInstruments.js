'use strict';

var base = require('base/paymentInstruments/paymentInstruments');
var cleave = require('../components/cleave');

base.handleCreditCardNumber = function () {
    if ($('#cardNumber').length && $('#cardType').length && $('.nav-item').data('method-id').indexOf('HIPAY') < 0) {
        cleave.handleCreditCardNumber('#cardNumber', '#cardType');
    }
};

module.exports = base;
