'use strict';

var assert = require('chai').assert;

var Money = require('../../../mocks/dw.value.Money');
var ArrayList = require('../../../mocks/dw.util.Collection');


var createApiBasket = function (isAvailable) {
    return {
        totalGrossPrice: new Money(isAvailable),
        totalTax: new Money(isAvailable),
        shippingTotalPrice: new Money(isAvailable),
        getAdjustedMerchandizeTotalPrice: function () {
            return new Money(isAvailable);
        },
        adjustedShippingTotalPrice: new Money(isAvailable),
        couponLineItems: new ArrayList([
            {
                UUID: 1234567890,
                couponCode: 'some coupon code',
                applied: true,
                valid: true,
                priceAdjustments: new ArrayList([{
                    promotion: { calloutMsg: 'some call out message' }
                }])
            }
        ]),
        priceAdjustments: new ArrayList([{
            UUID: 10987654321,
            calloutMsg: 'some call out message',
            basedOnCoupon: false,
            price: { value: 'some value', currencyCode: 'usd' },
            lineItemText: 'someString',
            promotion: { calloutMsg: 'some call out message' }
        }]),
        allShippingPriceAdjustments: new ArrayList([{
            UUID: 12029384756,
            calloutMsg: 'some call out message',
            basedOnCoupon: false,
            price: { value: 'some value', currencyCode: 'usd' },
            lineItemText: 'someString',
            promotion: { calloutMsg: 'some call out message' }
        }])
    };
};

describe('Totals', function () {
    var Totals = require('../../../mocks/models/totals');

    it('should accept/process a null Basket object', function () {
        var result = new Totals(null);
        assert.equal(result.subTotal, '-');
        assert.equal(result.grandTotal, '-');
        assert.equal(result.totalTax, '-');
        assert.equal(result.totalShippingCost, '-');
    });

    it('should accept a basket and format the totals', function () {
        var basket = createApiBasket(true);
        var result = new Totals(basket);
        assert.equal(result.subTotal, 'formatted money');
        assert.equal(result.grandTotal, 'formatted money');
        assert.equal(result.totalTax, 'formatted money');
        assert.equal(result.totalShippingCost, 'formatted money');
    });

    it('should get discounts', function () {
        var result = new Totals(createApiBasket(true));
        assert.equal(result.discounts.length, 3);
        assert.equal(result.discounts[0].UUID, 1234567890);
        assert.equal(result.discounts[0].type, 'coupon');
        assert.equal(result.discounts[0].applied, true);
        assert.equal(result.discounts[1].type, 'promotion');
        assert.equal(result.discounts[1].callOutMsg, 'some call out message');
        assert.equal(result.discounts[1].UUID, 10987654321);
        assert.equal(result.discounts[2].UUID, 12029384756);
    });

    it('should accept a basket where the totals are unavailable', function () {
        var result = new Totals(createApiBasket(false));
        assert.equal(result.subTotal, '-');
        assert.equal(result.grandTotal, '-');
        assert.equal(result.totalTax, '-');
        assert.equal(result.totalShippingCost, '-');
    });
});
