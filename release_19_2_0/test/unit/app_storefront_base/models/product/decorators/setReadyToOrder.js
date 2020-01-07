'use strict';

var assert = require('chai').assert;

describe('set ready to order decorator', function () {
    var readyToOrder = require('../../../../../../cartridges/app_storefront_base/cartridge/models/product/decorators/setReadyToOrder');

    it('should create readyToOrder property for passed in object', function () {
        var object = {};
        object.individualProducts = [{
            readyToOrder: true
        }];
        readyToOrder(object);

        assert.isTrue(object.readyToOrder);
    });

    it('should create readyToOrder property for passed in object', function () {
        var object = {};
        object.individualProducts = [{
            readyToOrder: false
        }];
        readyToOrder(object);

        assert.isFalse(object.readyToOrder);
    });
});
