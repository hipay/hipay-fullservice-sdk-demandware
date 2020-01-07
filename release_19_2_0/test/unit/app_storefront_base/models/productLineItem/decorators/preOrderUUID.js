'use strict';

var assert = require('chai').assert;

var lineItemMock = {
    custom: {
        preOrderUUID: 'someUUID'
    }
};

describe('bonus product line item pre order uuid decorator', function () {
    var preOrderUUID = require('../../../../../../cartridges/app_storefront_base/cartridge/models/productLineItem/decorators/preOrderUUID');

    it('should create preOrderUUID property for passed in object', function () {
        var object = {};
        preOrderUUID(object, lineItemMock);

        assert.equal(object.preOrderUUID, 'someUUID');
    });
});
