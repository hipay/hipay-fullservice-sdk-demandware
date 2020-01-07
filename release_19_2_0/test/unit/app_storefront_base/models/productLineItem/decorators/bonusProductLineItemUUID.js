'use strict';

var assert = require('chai').assert;

var lineItemMock = {
    custom: {
        bonusProductLineItemUUID: 'someUUID'
    }
};

describe('bonus product line item uuid decorator', function () {
    var bonusProductLineItemUUID = require('../../../../../../cartridges/app_storefront_base/cartridge/models/productLineItem/decorators/bonusProductLineItemUUID');

    it('should create bonusProductLineItemUUID property for passed in object', function () {
        var object = {};
        bonusProductLineItemUUID(object, lineItemMock);

        assert.equal(object.bonusProductLineItemUUID, 'someUUID');
    });
});
