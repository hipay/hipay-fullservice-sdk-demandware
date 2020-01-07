'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var ArrayList = require('../../../../../mocks/dw.util.Collection');

var productMock = {
    bundledProducts: new ArrayList([{
        ID: 'some id'
    }])
};

var quantity = 1;

var productFactoryMock = {
    get: function () {
        return 'some product';
    }
};

describe('bundled product decorator', function () {
    var collections = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/scripts/util/collections', {
        'dw/util/ArrayList': ArrayList
    });

    var bundledProducts = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/product/decorators/bundledProducts', {
        '*/cartridge/scripts/util/collections': collections
    });

    it('should create a property on the passed in object called bundledProducts', function () {
        var object = {};
        bundledProducts(object, productMock, quantity, productFactoryMock);

        assert.equal(object.bundledProducts.length, 1);
    });
});
