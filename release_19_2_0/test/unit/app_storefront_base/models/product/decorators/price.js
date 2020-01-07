'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

describe('product price decorator', function () {
    var price = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/product/decorators/price', {
        '*/cartridge/scripts/factories/price': {
            getPrice: function () { return 'Product Price'; }
        }
    });

    it('should create a property on the passed in object called price', function () {
        var object = {};
        price(object, {}, {}, true, {});

        assert.equal(object.price, 'Product Price');
    });
});
