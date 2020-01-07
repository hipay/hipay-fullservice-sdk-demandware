'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var ArrayList = require('../../../../../mocks/dw.util.Collection');

var productMock = {
    bundledProducts: new ArrayList([{
        ID: 'some id'
    }])
};

var productFactoryMock = {
    get: function () {
        return 'some product';
    }
};

describe(' set individual products decorator', function () {
    var collections = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/scripts/util/collections', {
        'dw/util/ArrayList': ArrayList
    });

    var individualProducts = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/product/decorators/setIndividualProducts', {
        '*/cartridge/scripts/util/collections': collections
    });

    it('should create a property on the passed in object called individualProducts', function () {
        var object = {};
        individualProducts(object, productMock, productFactoryMock);

        assert.equal(object.individualProducts.length, 1);
    });
});
