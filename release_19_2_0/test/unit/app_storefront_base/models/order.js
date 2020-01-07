'use strict';

var assert = require('chai').assert;

var Order = require('../../../mocks/models/order');

var createApiBasket = function () {
    return {
        billingAddress: true,
        defaultShipment: {
            shippingAddress: true
        },
        orderNo: 'some String',
        creationDate: 'some Date',
        customerEmail: 'some Email',
        status: 'some status',
        productQuantityTotal: 1,
        totalGrossPrice: {
            available: true,
            value: 180.00
        },
        totalTax: {
            available: true,
            value: 20.00
        },
        shippingTotalPrice: {
            available: true,
            value: 20.00,
            subtract: function () {
                return {
                    value: 20.00
                };
            }
        },
        discounts: [],
        adjustedShippingTotalPrice: {
            value: 20.00,
            available: true
        },
        shipments: [{
            id: 'me'
        }],

        getAdjustedMerchandizeTotalPrice: function () {
            return {
                subtract: function () {
                    return {
                        value: 100.00
                    };
                },
                value: 140.00,
                available: true
            };
        }
    };
};

var config = {
    numberOfLineItems: '*'
};

describe('Order', function () {
    it('should handle null parameters', function () {
        var result = new Order(null, null);
        assert.equal(result.shipping, null);
        assert.equal(result.billing, null);
        assert.equal(result.totals, null);
        assert.equal(result.items, null);
        assert.equal(result.steps, null);
        assert.equal(result.orderNumber, null);
        assert.equal(result.creationDate, null);
        assert.equal(result.orderEmail, null);
    });

    it('should handle a basket object ', function () {
        var result = new Order(createApiBasket(), { config: config });
        assert.deepEqual(result.steps, {
            shipping: {
                iscompleted: true
            },
            billing: {
                iscompleted: true
            }
        });
        assert.equal(result.orderNumber, 'some String');
        assert.equal(result.creationDate, 'some Date');
        assert.equal(result.orderEmail, 'some Email');
    });

    it('should handle a single lineitem basket object ', function () {
        var result = new Order(createApiBasket(), { config: {
            numberOfLineItems: 'single'
        } });
        assert.equal(result.shippedToFirstName, 'someString');
        assert.equal(result.shippedToLastName, '');
        assert.equal(result.orderNumber, 'some String');
        assert.equal(result.creationDate, 'some Date');
        assert.equal(result.orderEmail, 'some Email');
    });

    // !!! NOT APPLICABLE
    //  ... every lineItemContainer (basket/order) has a defaultShipment
    it('should handle a basket that does not have a defaultShipment', function () {
        var basket = createApiBasket();
        basket.billingAddress = true;
        basket.defaultShipment = null;

        var result = new Order(basket, { config: config });
        assert.deepEqual(result.steps, {
            shipping: {
                iscompleted: true
            },
            billing: {
                iscompleted: true
            }
        });
    });

    it('should return the subset of the order model when using config.numberOfLineItems = "single".', function () {
        var basket = createApiBasket();
        config = {
            numberOfLineItems: 'single'
        };

        basket.productLineItems = [{
            length: 2,
            quantity: {
                value: 1
            },
            items: [
                {
                    images: {
                        small: [
                            {
                                url: 'url to small image',
                                alt: 'url to small image',
                                title: 'url to small image'
                            }
                        ]
                    }
                }
            ]
        }];

        basket.shipping = [{
            shippingAddress: {
                firstName: 'John',
                lastName: 'Snow'
            }
        }];

        basket.totals = {
            grandTotal: '$129.87'
        };

        var result = new Order(basket, { config: config });
        assert.equal(result.creationDate, 'some Date');
        assert.equal(result.productQuantityTotal, 1);
        // assert.equal(result.priceTotal, basket.totalGrossPrice.value);
        assert.equal(result.orderStatus, 'some status');
        assert.equal(result.orderNumber, 'some String');
        assert.equal(result.orderEmail, 'some Email');
    });
});
