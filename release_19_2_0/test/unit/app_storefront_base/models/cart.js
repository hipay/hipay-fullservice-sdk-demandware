'use strict';

var assert = require('chai').assert;
var ArrayList = require('../../../mocks/dw.util.Collection');

var toProductMock = require('../../../util');

var productVariantMock = {
    ID: '1234567',
    name: 'test product',
    variant: true,
    availabilityModel: {
        isOrderable: {
            return: true,
            type: 'function'
        },
        inventoryRecord: {
            ATS: {
                value: 100
            }
        }
    },
    minOrderQuantity: {
        value: 2
    }
};

var productMock = {
    variationModel: {
        productVariationAttributes: new ArrayList([{
            attributeID: '',
            value: ''
        }]),
        selectedVariant: productVariantMock
    }
};

var Money = require('../../../mocks/dw.value.Money');


var createApiBasket = function (options) {
    var safeOptions = options || {};

    var basket = {
        allProductLineItems: new ArrayList([{
            bonusProductLineItem: false,
            gift: false,
            UUID: 'some UUID',
            adjustedPrice: {
                value: 'some value',
                currencyCode: 'US'
            },
            quantity: {
                value: 1
            },
            product: toProductMock(productMock)
        }]),
        totalGrossPrice: new Money(true),
        totalTax: new Money(true),
        shippingTotalPrice: new Money(true)
    };


    if (safeOptions.shipping) {
        basket.shipments = [safeOptions.shipping];
    } else {
        basket.shipments = [{
            shippingMethod: {
                ID: '005'
            }
        }];
    }
    basket.defaultShipment = basket.shipments[0];

    basket.getShipments = function () {
        return basket.shipments;
    };
    basket.getAdjustedMerchandizeTotalPrice = function () {
        return new Money(true);
    };

    if (safeOptions.productLineItems) {
        basket.productLineItems = safeOptions.productLineItems;
    }

    if (safeOptions.totals) {
        basket.totals = safeOptions.totals;
    }

    return basket;
};

describe('cart', function () {
    var Cart = require('../../../mocks/models/cart');

    it('should accept/process a null Basket object', function () {
        var nullBasket = null;
        var result = new Cart(nullBasket);

        assert.equal(result.items.length, 0);
        assert.equal(result.numItems, 0);
    });

    it('should get shippingMethods from the shipping model', function () {
        var result = new Cart(createApiBasket());
        assert.equal(result.shipments[0].shippingMethods[0].description, 'Order received within 7-10 ' +
            'business days'
        );
        assert.equal(result.shipments[0].shippingMethods[0].displayName, 'Ground');
        assert.equal(result.shipments[0].shippingMethods[0].ID, '001');
        assert.equal(result.shipments[0].shippingMethods[0].shippingCost, '$0.00');
        assert.equal(result.shipments[0].shippingMethods[0].estimatedArrivalTime, '7-10 Business Days');
    });

    it('should get totals from totals model', function () {
        var result = new Cart(createApiBasket());
        assert.equal(result.totals.subTotal, 'formatted money');
        assert.equal(result.totals.grandTotal, 'formatted money');
        assert.equal(result.totals.totalTax, 'formatted money');
        assert.equal(result.totals.totalShippingCost, 'formatted money');
    });
    // it('should get approaching discounts', function () {
    //     var result = new Cart(createApiBasket());
    //     assert.equal(result.approachingDiscounts[0].discountMsg, 'someString');
    //     assert.equal(result.approachingDiscounts[1].discountMsg, 'someString');
    // });
});
