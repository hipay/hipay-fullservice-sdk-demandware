'use strict';

var assert = require('chai').assert;

describe('product line item quantity decorator', function () {
    var quantity = require('../../../../../../cartridges/app_storefront_base/cartridge/models/productLineItem/decorators/quantity');

    it('should create quantity property for passed in object', function () {
        var object = {};
        quantity(object, 1);

        assert.equal(object.quantity, 1);
    });
});
