'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

describe('product options decorator', function () {
    var options = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/product/decorators/options', {
        '*/cartridge/scripts/helpers/productHelpers': {
            getOptions: function () { return []; }
        }
    });

    it('should create a property on the passed in object called options', function () {
        var object = {};
        options(object, {}, {}, 1);

        assert.equal(object.options.length, 0);
    });
});
