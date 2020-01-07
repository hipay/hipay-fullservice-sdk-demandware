'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var productMock = {
    minOrderQuantity: {
        value: 1
    }
};

var quantity = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/product/decorators/quantity', {
    '*/cartridge/config/preferences': require('../../../../../mocks/config/preferences')
});

describe('product quantity decorator', function () {

    it('should create a property on the passed in object called selectedQuantity', function () {
        var object = {};
        quantity(object, productMock, 1);

        assert.equal(object.selectedQuantity, 1);
    });

    it('should handle null quantity', function () {
        var object = {};
        quantity(object, productMock);

        assert.equal(object.selectedQuantity, 1);
    });

    it('should handle empty product', function () {
        var object = {};
        quantity(object, {}, 1);

        assert.equal(object.selectedQuantity, 1);
    });

    it('should handle empty product and no quantity', function () {
        var object = {};
        quantity(object, {});

        assert.equal(object.selectedQuantity, 1);
    });

    it('should create a property on the passed in object called minOrderQuantity', function () {
        var object = {};
        quantity(object, productMock, 1);

        assert.equal(object.minOrderQuantity, 1);
    });

    it('should create a property on the passed in object called maxOrderQuantity', function () {
        var object = {};
        quantity(object, productMock, 1);

        assert.equal(object.maxOrderQuantity, 9);
    });
});
