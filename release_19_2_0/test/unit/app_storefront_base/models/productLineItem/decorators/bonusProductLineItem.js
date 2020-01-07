'use strict';

var assert = require('chai').assert;

var lineItemMock = {
    bonusProductLineItem: true
};

describe('set ready to order decorator', function () {
    var isBonusProductLineItem = require('../../../../../../cartridges/app_storefront_base/cartridge/models/productLineItem/decorators/bonusProductLineItem');

    it('should create isBonusProductLineItem property for passed in object', function () {
        var object = {};
        isBonusProductLineItem(object, lineItemMock);

        assert.isTrue(object.isBonusProductLineItem);
    });

    it('should create isBonusProductLineItem property for passed in object', function () {
        var object = {};
        lineItemMock.bonusProductLineItem = false;
        isBonusProductLineItem(object, lineItemMock);

        assert.isFalse(object.isBonusProductLineItem);
    });
});
