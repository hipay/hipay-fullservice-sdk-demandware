'use strict';

var assert = require('chai').assert;

describe('bundle ready to order decorator', function () {
    var readyToOrder = require('../../../../../../cartridges/app_storefront_base/cartridge/models/product/decorators/bundleReadyToOrder');

    it('should create readyToOrder property for passed in object', function () {
        var object = {};
        object.bundledProducts = [{
            available: true,
            readyToOrder: true
        }];
        readyToOrder(object);

        assert.isTrue(object.readyToOrder);
    });

    it('should create readyToOrder property for passed in object', function () {
        var object = {};
        object.bundledProducts = [{
            available: false,
            readyToOrder: false
        }];
        readyToOrder(object);

        assert.isFalse(object.readyToOrder);
    });
});
