'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var sinon = require('sinon');

var stubVariationAttributesModel = sinon.stub();
stubVariationAttributesModel.returns(['attribute1']);

describe('product variation attributes decorator', function () {
    var variationAttributes = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/product/decorators/variationAttributes', {
        '*/cartridge/models/product/productAttributes': stubVariationAttributesModel
    });

    it('should create a property on the passed in object called variationAttributes', function () {
        var object = { selectedQuantity: 2 };
        variationAttributes(object, {}, { selectedOptionsQueryParams: 'selectedOptionsParams' });

        assert.isTrue(stubVariationAttributesModel.calledOnce);
    });

    it('should create a property on the passed in object called variationAttributes', function () {
        var object = { selectedQuantity: 2 };
        stubVariationAttributesModel.reset();
        variationAttributes(object, null);

        assert.isTrue(stubVariationAttributesModel.notCalled);
    });
});
