'use strict';

var assert = require('chai').assert;

var lineItemMock = {
    gift: true
};

describe('product line item gift decorator', function () {
    var isGift = require('../../../../../../cartridges/app_storefront_base/cartridge/models/productLineItem/decorators/gift');

    it('should create isGift property for passed in object', function () {
        var object = {};
        isGift(object, lineItemMock);

        assert.isTrue(object.isGift);
    });

    it('should create isGift property for passed in object', function () {
        var object = {};
        lineItemMock.gift = false;
        isGift(object, lineItemMock);

        assert.isFalse(object.isGift);
    });
});
