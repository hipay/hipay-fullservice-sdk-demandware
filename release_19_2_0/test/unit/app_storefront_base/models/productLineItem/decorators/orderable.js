'use strict';

var assert = require('chai').assert;

var productMock = {
    availabilityModel: {
        isOrderable: function () { return true; }
    }
};

describe('product line item orderable decorator', function () {
    var isOrderable = require('../../../../../../cartridges/app_storefront_base/cartridge/models/productLineItem/decorators/orderable');

    it('should create isOrderable property for passed in object', function () {
        var object = {};
        isOrderable(object, productMock, 1);

        assert.isTrue(object.isOrderable);
    });
});
