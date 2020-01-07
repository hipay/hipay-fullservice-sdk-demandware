'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var ArrayList = require('../../../mocks/dw.util.Collection');

var currentCustomer = {
    addressBook: {
        addresses: {},
        preferredAddress: {
            address1: '15 South Point Drive',
            address2: null,
            city: 'Boston',
            countryCode: {
                displayValue: 'United States',
                value: 'US'
            },
            firstName: 'John',
            lastName: 'Snow',
            ID: 'Home',
            postalCode: '02125',
            stateCode: 'MA'
        }
    },
    customer: {},
    profile: {
        firstName: 'John',
        lastName: 'Snow',
        email: 'jsnow@starks.com'
    },
    wallet: {
        paymentInstruments: [
            {
                creditCardExpirationMonth: '3',
                creditCardExpirationYear: '2019',
                maskedCreditCardNumber: '***********4215',
                creditCardType: 'Visa',
                paymentMethod: 'CREDIT_CARD'
            },
            {
                creditCardExpirationMonth: '4',
                creditCardExpirationYear: '2019',
                maskedCreditCardNumber: '***********4215',
                creditCardType: 'Amex',
                paymentMethod: 'CREDIT_CARD'
            },
            {
                creditCardExpirationMonth: '6',
                creditCardExpirationYear: '2019',
                maskedCreditCardNumber: '***********4215',
                creditCardType: 'Master Card',
                paymentMethod: 'CREDIT_CARD'
            },
            {
                creditCardExpirationMonth: '5',
                creditCardExpirationYear: '2019',
                maskedCreditCardNumber: '***********4215',
                creditCardType: 'Discover',
                paymentMethod: 'CREDIT_CARD'
            }
        ]
    },
    raw: {
        authenticated: true,
        registered: true
    }
};

var addressModel = {
    address: {
        address1: '15 South Point Drive',
        address2: null,
        city: 'Boston',
        countryCode: {
            displayValue: 'United States',
            value: 'US'
        },
        firstName: 'John',
        lastName: 'Snow',
        ID: 'Home',
        postalCode: '02125',
        stateCode: 'MA'
    }
};

var orderModel = {
    orderNumber: '00000204',
    orderStatus: {
        displayValue: 'NEW'
    },
    creationDate: 'some Date',
    shippedToFirstName: 'John',
    shippedToLastName: 'Snow',
    shipping: {
        shippingAddress: {
            address1: '15 South Point Drive',
            address2: null,
            city: 'Boston',
            countryCode: {
                displayValue: 'United States',
                value: 'US'
            },
            firstName: 'John',
            lastName: 'Snow',
            ID: 'Home',
            phone: '123-123-1234',
            postalCode: '02125',
            stateCode: 'MA'
        }
    },
    items: new ArrayList([
        {
            product: {
                getImage: function () {
                    return {
                        URL: {
                            relative: function () {
                                return 'Some String';
                            }
                        }
                    };
                }
            }
        }
    ]),
    priceTotal: 125.99,
    totals: {
        grandTotal: 125.99
    },
    productQuantityTotal: 3
};

describe('account', function () {
    var AddressModel = require('../../../mocks/models/address');
    var AccountModel = proxyquire('../../../../cartridges/app_storefront_base/cartridge/models/account', {
        '*/cartridge/models/address': AddressModel,
        'dw/web/URLUtils': { staticURL: function () { return 'some URL'; } }
    });

    it('should receive customer profile', function () {
        var result = new AccountModel(currentCustomer);
        assert.equal(result.profile.firstName, 'John');
        assert.equal(result.profile.lastName, 'Snow');
        assert.equal(result.profile.email, 'jsnow@starks.com');
    });

    it('should receive customer wallet', function () {
        var result = new AccountModel(currentCustomer);
        assert.equal(result.payment.creditCardExpirationMonth, '3');
        assert.equal(result.payment.creditCardExpirationYear, '2019');
        assert.equal(result.payment.creditCardType, 'Visa');
        assert.equal(result.payment.maskedCreditCardNumber, '***********4215');

        assert.equal(result.customerPaymentInstruments.length, 4);
        assert.equal(result.customerPaymentInstruments[0].cardTypeImage.src, 'some URL');
        assert.equal(result.customerPaymentInstruments[0].cardTypeImage.alt, 'Visa');
    });

    it('should receive an account with address book, payment method and order history', function () {
        var result = new AccountModel(currentCustomer, addressModel, orderModel);

        assert.equal(result.profile.firstName, 'John');
        assert.equal(result.profile.lastName, 'Snow');
        assert.equal(result.profile.email, 'jsnow@starks.com');

        assert.equal(result.preferredAddress.address.address1, '15 South Point Drive');
        assert.equal(result.preferredAddress.address.address2, null);
        assert.equal(result.preferredAddress.address.city, 'Boston');
        assert.equal(result.preferredAddress.address.countryCode.displayValue, 'United States');
        assert.equal(result.preferredAddress.address.countryCode.value, 'US');
        assert.equal(result.preferredAddress.address.firstName, 'John');
        assert.equal(result.preferredAddress.address.lastName, 'Snow');
        assert.equal(result.preferredAddress.address.ID, 'Home');
        assert.equal(result.preferredAddress.address.postalCode, '02125');
        assert.equal(result.preferredAddress.address.stateCode, 'MA');

        assert.equal(result.orderHistory.orderNumber, '00000204');
        assert.equal(result.orderHistory.creationDate, 'some Date');
        assert.equal(result.orderHistory.orderStatus.displayValue, 'NEW');
        assert.equal(result.orderHistory.shippedToFirstName, 'John');
        assert.equal(result.orderHistory.shippedToLastName, 'Snow');
        assert.equal(result.orderHistory.priceTotal, 125.99);
        assert.equal(result.orderHistory.productQuantityTotal, 3);

        assert.equal(result.payment.maskedCreditCardNumber, '***********4215');
        assert.equal(result.payment.creditCardType, 'Visa');
        assert.equal(result.payment.creditCardExpirationMonth, '3');
        assert.equal(result.payment.creditCardExpirationYear, '2019');
    });

    // it('should receive an account with null addressbook', function () {
    //     var result = new AccountModel(currentCustomer);
    //     assert.equal(result.preferredAddress, null);
    // });

    it('should receive an account with null payment method', function () {
        currentCustomer.wallet = null;
        var result = new AccountModel(currentCustomer);
        assert.equal(result.payment, null);
    });

    it('should receive an account with null order history', function () {
        var result = new AccountModel(currentCustomer, addressModel, null);
        assert.equal(result.orderHistory, null);
    });
});
