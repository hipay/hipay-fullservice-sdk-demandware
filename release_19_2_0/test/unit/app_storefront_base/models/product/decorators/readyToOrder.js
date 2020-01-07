'use strict';

var assert = require('chai').assert;

var variationModelMock = {
    selectedVariant: {}
};

describe('product ready to order decorator', function () {
    var readyToOrder = require('../../../../../../cartridges/app_storefront_base/cartridge/models/product/decorators/readyToOrder');

    it('should create readyToOrder property for passed in object', function () {
        var object = {};
        readyToOrder(object, variationModelMock);

        assert.equal(object.readyToOrder, true);
    });

    it('should handle no variation model', function () {
        var object = {};
        readyToOrder(object, null);

        assert.equal(object.readyToOrder, true);
    });
});
