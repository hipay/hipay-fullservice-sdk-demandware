'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var ArrayList = require('../../../../../mocks/dw.util.Collection');

var currentBasketMock = {
    getBonusDiscountLineItems: function () {
        return new ArrayList([
            {
                UUID: 'someUUID',
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

var productMock = {};

describe('bonus product unit price', function () {
    var collections = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/scripts/util/collections', {
        'dw/util/ArrayList': ArrayList
    });
    var bonusUnitPrice = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/product/decorators/bonusUnitPrice', {
        'dw/order/BasketMgr': {
            getCurrentBasket: function () {
                return currentBasketMock;
            }
        },
        '*/cartridge/scripts/util/collections': collections
    });

    it('should create a property on the passed in object called bonusUnitPrice', function () {
        var object = {};
        var discountLineItemUUIDMock = 'someUUID';
        bonusUnitPrice(object, productMock, discountLineItemUUIDMock);

        assert.equal(object.bonusUnitPrice, 'someFormattedString');
    });

    it('should create a property on the passed in object called bonusUnitPrice when UUIDs do not match', function () {
        var object = {};
        var discountLineItemUUIDMock = 'someOtherUUID';
        bonusUnitPrice(object, productMock, discountLineItemUUIDMock);

        assert.equal(object.bonusUnitPrice, '');
    });
});
