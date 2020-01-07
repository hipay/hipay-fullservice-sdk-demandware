'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var ArrayList = require('../../../../../mocks/dw.util.Collection');

var bundledProductLineItemMock = {
    product: {
        ID: 'someID'
    },
    quantity: {
        value: 2
    }
};

var lineItemMock = {
    bundledProductLineItems: new ArrayList([bundledProductLineItemMock])
};

var productFactoryMock = {
    get: function () {
        return 'some product';
    }
};

describe('bundled product decorator', function () {
    var collections = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/scripts/util/collections', {
        'dw/util/ArrayList': ArrayList
    });

    var bundledProducts = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/productLineItem/decorators/bundledProductLineItems', {
        '*/cartridge/scripts/util/collections': collections
    });

    it('should create a property on the passed in object called bundledProductLineItems', function () {
        var object = {};
        bundledProducts(object, lineItemMock, productFactoryMock);

        assert.equal(object.bundledProductLineItems.length, 1);
    });
});
