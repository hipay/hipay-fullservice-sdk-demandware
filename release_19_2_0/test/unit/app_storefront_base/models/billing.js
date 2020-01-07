'use strict';

var assert = require('chai').assert;
var BillingModel = require('../../../mocks/models/billing');

var billingAddress = {
    address: {}
};

var paymentModel = {
    applicablePaymentMethods: 'array of payment methods',
    applicablePaymentCards: 'array of credit cards',
    selectedPaymentInstruments: 'array of selected payment options'
};

describe('billing', function () {
    it('should handle a null address', function () {
        var result = new BillingModel(null);
        assert.equal(result.billingAddress, null);
    });

    it('should handle an address', function () {
        var result = new BillingModel(billingAddress);
        assert.deepEqual(result.billingAddress.address, {});
    });

    it('should handle a paymentModel', function () {
        var result = new BillingModel(null, paymentModel);
        assert.equal(result.payment.applicablePaymentMethods, 'array of payment methods');
        assert.equal(result.payment.applicablePaymentCards, 'array of credit cards');
        assert.equal(
            result.payment.selectedPaymentInstruments,
            'array of selected payment options'
        );
    });
});
