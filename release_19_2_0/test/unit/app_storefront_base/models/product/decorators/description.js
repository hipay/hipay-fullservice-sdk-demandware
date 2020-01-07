'use strict';

var assert = require('chai').assert;

var productMock = {
    longDescription: {
        markup: 'long description mark up'
    },
    shortDescription: {
        markup: 'short description mark up'
    }
};

var productMockNoDescription = {};

describe('product description decorator', function () {
    var description = require('../../../../../../cartridges/app_storefront_base/cartridge/models/product/decorators/description');

    it('should create longDescription property for passed in object', function () {
        var object = {};
        description(object, productMock);

        assert.equal(object.longDescription, 'long description mark up');
    });

    it('should handle null long description', function () {
        var object = {};
        description(object, productMockNoDescription);

        assert.equal(object.longDescription, null);
    });

    it('should create shortDescription property for passed in object', function () {
        var object = {};
        description(object, productMock);

        assert.equal(object.shortDescription, 'short description mark up');
    });

    it('should handel null short description', function () {
        var object = {};
        description(object, productMockNoDescription);

        assert.equal(object.shortDescription, null);
    });
});
