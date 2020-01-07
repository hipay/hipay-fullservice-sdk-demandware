'use strict';

var assert = require('chai').assert;

describe('raw product decorator', function () {
    var raw = require('../../../../../../cartridges/app_storefront_base/cartridge/models/product/decorators/raw');

    it('should create someRawProduct for passed in object', function () {
        var object = {};
        raw(object, 'someRawProduct');

        assert.equal(object.raw, 'someRawProduct');
    });
});
