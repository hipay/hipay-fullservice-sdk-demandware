'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var ArrayList = require('../../../../../mocks/dw.util.Collection');

var currentBasketMock = {
    getBonusDiscountLineItems: function () {
        return new ArrayList([
            {
                custom: { bonusProductLineItemUUID: 'someUUID' },
                getBonusProductPrice: function () {
                    return {
                        toFormattedString: function () {
                            return 'someFormattedString';
                        }
                    };
                }
            }
        ]);
    }
};

var lineItemMock = {
    custom: {
        bonusProductLineItemUUID: 'someUUID'
    }
};

var otherLineItemMock = {
    custom: {
        bonusProductLineItemUUID: 'someOtherUUID'
    }
};

var productMock = {};

describe('bonus product unit price', function () {
    var collections = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/scripts/util/collections', {
        'dw/util/ArrayList': ArrayList
    });
    var bonusUnitPrice = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/productLineItem/decorators/bonusUnitPrice', {
        'dw/order/BasketMgr': {
            getCurrentBasket: function () {
                return currentBasketMock;
            }
        },
        '*/cartridge/scripts/util/collections': collections
    });

    it('should create a property on the passed in object called bonusUnitPrice', function () {
        var object = {};

        bonusUnitPrice(object, lineItemMock, productMock);

        assert.equal(object.bonusUnitPrice, 'someFormattedString');
    });

    it('should create a property on the passed in object called bonusUnitPrice when UUIDs do not match', function () {
        var object = {};
        bonusUnitPrice(object, otherLineItemMock, productMock);

        assert.equal(object.bonusUnitPrice, '');
    });

    it('should create a property on the passed in object called bonusUnitPrice when no current basket', function () {
        var object = {};
        currentBasketMock = null;
        bonusUnitPrice(object, lineItemMock, productMock);

        assert.equal(object.bonusUnitPrice, '');
    });
});
