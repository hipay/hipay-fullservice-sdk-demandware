'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var sinon = require('sinon');
var ArrayList = require('../../../../../mocks/dw.util.Collection');

var bonusDiscountLineItem = {
    custom: {
        bonusProductLineItemUUID: 'someBonusProductLineItemUUID'
    },
    UUID: 'someUUID',
    maxBonusItems: 1,
    quantityValue: 1,
    bonusProductLineItems: new ArrayList([{
        quantityValue: 1
    }])
};

var getCurrentBasketStub = sinon.stub();

var currentBasketMock = {
    bonusDiscountLineItems: new ArrayList([bonusDiscountLineItem])
};

describe('discount bonus line item decorator', function () {
    var collections = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/scripts/util/collections', {
        'dw/util/ArrayList': ArrayList
    });
    var discountBonusLineItems = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/productLineItem/decorators/discountBonusLineItems', {
        'dw/order/BasketMgr': {
            getCurrentBasket: getCurrentBasketStub
        },
        '*/cartridge/scripts/util/collections': collections,
        'dw/web/URLUtils': {
            url: function () {
                return 'someURL';
            }
        },
        'dw/web/Resource': {
            msg: function () {
                return 'someResourceString';
            }
        }
    });

    it('should create a property on the passed in object called discountLineItems', function () {
        var object = {};
        var UUIDMock = 'someBonusProductLineItemUUID';
        getCurrentBasketStub.returns(currentBasketMock);
        discountBonusLineItems(object, UUIDMock);

        assert.equal(object.discountLineItems.length, 1);
        assert.equal(object.discountLineItems[0].pliuuid, 'someBonusProductLineItemUUID');
        assert.equal(object.discountLineItems[0].uuid, 'someUUID');
        assert.isFalse(object.discountLineItems[0].full);
        assert.equal(object.discountLineItems[0].maxpids, 1);
        assert.equal(object.discountLineItems[0].url, 'someURL');
        assert.equal(object.discountLineItems[0].msg, 'someResourceString');
    });

    it('should create a property on the passed in object called discountLineItems when UUID and bonusProductLineItemUUID are not a match ', function () {
        var object = {};
        var UUIDMock = 'someUUID';
        getCurrentBasketStub.returns(currentBasketMock);
        discountBonusLineItems(object, UUIDMock);

        assert.equal(object.discountLineItems.length, 0);
    });

    it('should create a property on the passed in object called discountLineItems when the max items have not been selected', function () {
        var object = {};
        getCurrentBasketStub.returns(currentBasketMock);
        bonusDiscountLineItem.maxBonusItems = 2;
        bonusDiscountLineItem.quantityValue = 0;
        var UUIDMock = 'someBonusProductLineItemUUID';
        discountBonusLineItems(object, UUIDMock);

        assert.equal(object.discountLineItems.length, 1);
    });
    it('should create a property on the passed in object when getCurrentBasket returns null', function () {
        var object = {};
        var UUIDMock = 'someUUID';
        getCurrentBasketStub.returns(null);
        discountBonusLineItems(object, UUIDMock);

        assert.equal(object.discountLineItems.length, 0);
    });
});
