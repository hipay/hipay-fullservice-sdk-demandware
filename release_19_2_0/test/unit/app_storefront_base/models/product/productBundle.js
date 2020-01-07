'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var object = {};

var productMock = {
    attributeModel: {},
    minOrderQuantity: { value: 'someValue' },
    availabilityModel: {},
    stepQuantity: { value: 'someOtherValue' },
    getPrimaryCategory: function () { return { custom: { sizeChartID: 'someID' } }; },
    getMasterProduct: function () {
        return {
            getPrimaryCategory: function () { return { custom: { sizeChartID: 'someID' } }; }
        };
    },
    ID: 'someID'
};

var optionsMock = {
    productType: 'someProductType',
    optionModel: {},
    quantity: 1,
    variationModel: {},
    promotions: [],
    variables: []
};

describe('Product Bundle Model', function () {
    var decorators = require('../../../../mocks/productDecoratorsMock');

    var productBundle = proxyquire('../../../../../cartridges/app_storefront_base/cartridge/models/product/productBundle', {
        '*/cartridge/models/product/decorators/index': decorators.mocks
    });

    afterEach(function () {
        decorators.stubs.stubBase.reset();
        decorators.stubs.stubPrice.reset();
        decorators.stubs.stubImages.reset();
        decorators.stubs.stubAvailability.reset();
        decorators.stubs.stubDescription.reset();
        decorators.stubs.stubSearchPrice.reset();
        decorators.stubs.stubPromotions.reset();
        decorators.stubs.stubQuantity.reset();
        decorators.stubs.stubQuantitySelector.reset();
        decorators.stubs.stubRatings.reset();
        decorators.stubs.stubSizeChart.reset();
        decorators.stubs.stubVariationAttributes.reset();
        decorators.stubs.stubSearchVariationAttributes.reset();
        decorators.stubs.stubAttributes.reset();
        decorators.stubs.stubOptions.reset();
        decorators.stubs.stubCurrentUrl.reset();
        decorators.stubs.stubReadyToOrder.reset();
        decorators.stubs.stubSetReadyToOrder.reset();
        decorators.stubs.stubBundleReadyToOrder.reset();
        decorators.stubs.stubSetIndividualProducts.reset();
        decorators.stubs.stubBundledProducts.reset();
    });

    it('should call base for bundle product', function () {
        productBundle(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubBase.calledOnce);
    });

    it('should call price for bundle product', function () {
        productBundle(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubPrice.calledOnce);
    });

    it('should call images for bundle product', function () {
        productBundle(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubImages.calledOnce);
    });

    it('should call quantity for bundle product', function () {
        productBundle(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubQuantity.calledOnce);
    });

    it('should call variationAttributes for bundle product', function () {
        productBundle(object, productMock, optionsMock);

        assert.isFalse(decorators.stubs.stubVariationAttributes.calledOnce);
    });

    it('should call description for bundle product', function () {
        productBundle(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubDescription.calledOnce);
    });

    it('should call ratings for bundle product', function () {
        productBundle(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubRatings.calledOnce);
    });

    it('should call promotion for bundle product', function () {
        productBundle(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubPromotions.calledOnce);
    });

    it('should call attributes for bundle product', function () {
        productBundle(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubAttributes.calledOnce);
    });

    it('should call availability for bundle product', function () {
        productBundle(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubAvailability.calledOnce);
    });

    it('should call options for bundle product', function () {
        productBundle(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubOptions.calledOnce);
    });

    it('should call quantitySelector for bundle product', function () {
        productBundle(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubQuantitySelector.calledOnce);
    });

    it('should call sizeChart for bundle product', function () {
        productBundle(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubSizeChart.calledOnce);
    });

    it('should call currentUrl for bundle product', function () {
        productBundle(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubCurrentUrl.calledOnce);
    });

    it('should call bundleReadyToOrder for bundle product', function () {
        productBundle(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubBundleReadyToOrder.calledOnce);
    });

    it('should not call readyToOrder for bundle product', function () {
        productMock.getPrimaryCategory = function () { return null; };
        productBundle(object, productMock, optionsMock);

        assert.isFalse(decorators.stubs.stubReadyToOrder.calledOnce);
    });
});
