'use strict';

var assert = require('chai').assert;

var productModelMock = {
    ID: 'some ID',
    name: 'some name',
    UUID: 'some UUID',
    brand: 'some brand'
};

describe('product base decorator', function () {
    var base = require('../../../../../../cartridges/app_storefront_base/cartridge/models/product/decorators/base');

    it('should create uuid property for passed in object', function () {
        var object = {};
        base(object, productModelMock, 'variant');

        assert.equal(object.uuid, 'some UUID');
    });

    it('should create id property for passed in object', function () {
        var object = {};
        base(object, productModelMock, 'variant');

        assert.equal(object.id, 'some ID');
    });

    it('should create productName property for passed in object', function () {
        var object = {};
        base(object, productModelMock, 'variant');

        assert.equal(object.productName, 'some name');
    });

    it('should create productType property for passed in object', function () {
        var object = {};
        base(object, productModelMock, 'variant');

        assert.equal(object.productType, 'variant');
    });

    it('should create brand property for passed in object', function () {
        var object = {};
        base(object, productModelMock, 'variant');

        assert.equal(object.brand, 'some brand');
    });
});
