'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var ArrayList = require('../../../../../mocks/dw.util.Collection');

var productMock = {
    getImages: function () {
        return new ArrayList([]);
    }
};

describe('product images decorator', function () {
    var collections = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/scripts/util/collections', {
        'dw/util/ArrayList': ArrayList
    });

    var imagesModel = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/product/productImages', {
        '*/cartridge/scripts/util/collections': collections
    });

    var images = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/product/decorators/images', {
        '*/cartridge/models/product/productImages': imagesModel
    });

    it('should create a property on the passed in object called images', function () {
        var object = {};
        images(object, productMock, { types: ['large', 'small'], quantity: 'all' });

        assert.equal(object.images.large.length, 0);
        assert.equal(object.images.small.length, 0);
    });
});
