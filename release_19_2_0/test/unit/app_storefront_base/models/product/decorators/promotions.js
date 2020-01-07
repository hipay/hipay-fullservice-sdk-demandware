'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var ArrayList = require('../../../../../mocks/dw.util.Collection');

var promotionMock = {
    calloutMsg: {
        markup: 'callout message mark up'
    },
    details: {
        markup: 'details mark up'
    },
    enabled: true,
    ID: 'someID',
    name: 'someName',
    promotionClass: 'someClass',
    rank: 'someRank'
};

var promotionsMock = new ArrayList([promotionMock]);

var noPromotions = new ArrayList([]);

describe('product promotions decorator', function () {
    var collections = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/scripts/util/collections', {
        'dw/util/ArrayList': ArrayList
    });

    var promotions = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/product/decorators/promotions', {
        '*/cartridge/scripts/util/collections': collections
    });

    it('should create a property on the passed in object called promotions', function () {
        var object = {};
        promotions(object, promotionsMock);

        assert.equal(object.promotions.length, 1);
        assert.equal(object.promotions[0].id, 'someID');
        assert.equal(object.promotions[0].name, 'someName');
        assert.equal(object.promotions[0].calloutMsg, 'callout message mark up');
        assert.equal(object.promotions[0].details, 'details mark up');
        assert.isTrue(object.promotions[0].enabled);
        assert.equal(object.promotions[0].promotionClass, 'someClass');
        assert.equal(object.promotions[0].rank, 'someRank');
    });

    it('should handle empty array of promotions', function () {
        var object = {};
        promotions(object, noPromotions);

        assert.equal(object.promotions, null);
    });

    it('should handle promotions with no callout message', function () {
        var object = {};
        promotionMock.calloutMsg = null;
        promotionMock.details = null;
        promotions(object, promotionsMock);

        assert.equal(object.promotions[0].calloutMsg, '');
    });

    it('should handle promotions with no details', function () {
        var object = {};
        promotionMock.details = null;
        promotions(object, promotionsMock);

        assert.equal(object.promotions[0].details, '');
    });
});
