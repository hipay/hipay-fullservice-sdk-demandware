'use strict';

var assert = require('chai').assert;

var lineItemMock = {
    UUID: 'someUUID'
};

describe('product line item uuid decorator', function () {
    var uuid = require('../../../../../../cartridges/app_storefront_base/cartridge/models/productLineItem/decorators/uuid');

    it('should create UUID property for passed in object', function () {
        var object = {};
        uuid(object, lineItemMock);

        assert.equal(object.UUID, 'someUUID');
    });
});
