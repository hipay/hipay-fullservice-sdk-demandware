'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var ArrayList = require('../../../../../mocks/dw.util.Collection');

describe('product line item applied promotions decorator', function () {
    var collections = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/scripts/util/collections', {
        'dw/util/ArrayList': ArrayList
    });

    var appliedPromotions = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/productLineItem/decorators/appliedPromotions', {
        '*/cartridge/scripts/util/collections': collections,
        'dw/web/Resource': { msg: function () { return 'test discount'; } }
    });

    it('should create a property on the passed in object called appliedPromotions', function () {
        var object = {};

        var promotionMock = {
            promotion: {
                calloutMsg: {
                    markup: 'someCallOutMsg'
                },
                name: 'somePromotionName',
                details: {
                    markup: 'someDetails'
                }
            }
        };

        var lineItemMock = { priceAdjustments: new ArrayList([promotionMock]) };
        appliedPromotions(object, lineItemMock);

        assert.equal(object.appliedPromotions.length, 1);
        assert.equal(object.appliedPromotions[0].callOutMsg, 'someCallOutMsg');
        assert.equal(object.appliedPromotions[0].name, 'somePromotionName');
        assert.equal(object.appliedPromotions[0].details, 'someDetails');
    });

    it('should handle no applied promotions', function () {
        var object = {};

        var lineItemMock = { priceAdjustments: new ArrayList([]) };
        appliedPromotions(object, lineItemMock);

        assert.equal(object.appliedPromotions, undefined);
    });

    it('should handle no callout message', function () {
        var object = {};

        var promotionMock = {
            promotion: {
                name: 'somePromotionName',
                details: {
                    markup: 'someDetails'
                }
            }
        };

        var lineItemMock = { priceAdjustments: new ArrayList([promotionMock]) };
        appliedPromotions(object, lineItemMock);

        assert.equal(object.appliedPromotions.length, 1);
        assert.equal(object.appliedPromotions[0].callOutMsg, '');
        assert.equal(object.appliedPromotions[0].name, 'somePromotionName');
        assert.equal(object.appliedPromotions[0].details, 'someDetails');
    });

    it('should handle no details', function () {
        var object = {};

        var promotionMock = {
            promotion: {
                calloutMsg: {
                    markup: 'someCallOutMsg'
                },
                name: 'somePromotionName'
            }
        };

        var lineItemMock = { priceAdjustments: new ArrayList([promotionMock]) };
        appliedPromotions(object, lineItemMock);

        assert.equal(object.appliedPromotions.length, 1);
        assert.equal(object.appliedPromotions[0].callOutMsg, 'someCallOutMsg');
        assert.equal(object.appliedPromotions[0].name, 'somePromotionName');
        assert.equal(object.appliedPromotions[0].details, '');
    });

    it('should use default message if no promotion is available', function () {
        var object = {};

        var lineItemMock = { priceAdjustments: new ArrayList([{}]) };
        appliedPromotions(object, lineItemMock);

        assert.equal(object.appliedPromotions.length, 1);
        assert.equal(object.appliedPromotions[0].callOutMsg, 'test discount');
    });
});
