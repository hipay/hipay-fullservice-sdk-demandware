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

describe('Product Set Model', function () {
    var decorators = require('../../../../mocks/productDecoratorsMock');

    var productSet = proxyquire('../../../../../cartridges/app_storefront_base/cartridge/models/product/productSet', {
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

    it('should call base for set product', function () {
        productSet(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubBase.calledOnce);
    });

    it('should call price for set product', function () {
        productSet(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubPrice.calledOnce);
    });

    it('should call images for set product', function () {
        productSet(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubImages.calledOnce);
    });

    it('should call quantity for set product', function () {
        productSet(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubQuantity.calledOnce);
    });

    it('should not call variationAttributes for set product', function () {
        productSet(object, productMock, optionsMock);

        assert.isFalse(decorators.stubs.stubVariationAttributes.calledOnce);
    });

    it('should call description for set product', function () {
        productSet(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubDescription.calledOnce);
    });

    it('should not call ratings for set product', function () {
        productSet(object, productMock, optionsMock);

        assert.isFalse(decorators.stubs.stubRatings.calledOnce);
    });

    it('should call promotion for set product', function () {
        productSet(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubPromotions.calledOnce);
    });

    it('should not call attributes for set product', function () {
        productSet(object, productMock, optionsMock);

        assert.isFalse(decorators.stubs.stubAttributes.calledOnce);
    });

    it('should not call availability for set product', function () {
        productSet(object, productMock, optionsMock);

        assert.isFalse(decorators.stubs.stubAvailability.calledOnce);
    });

    it('should not call options for set product', function () {
        productSet(object, productMock, optionsMock);

        assert.isFalse(decorators.stubs.stubOptions.calledOnce);
    });

    it('should not call quantitySelector for set product', function () {
        productSet(object, productMock, optionsMock);

        assert.isFalse(decorators.stubs.stubQuantitySelector.calledOnce);
    });

    it('should not call sizeChart for set product', function () {
        productSet(object, productMock, optionsMock);

        assert.isFalse(decorators.stubs.stubSizeChart.calledOnce);
    });

    it('should call currentUrl for set product', function () {
        productSet(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubCurrentUrl.calledOnce);
    });

    it('should call setIndividualProducts for set product', function () {
        productSet(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubSetIndividualProducts.calledOnce);
    });

    it('should call setReadyToOrder for set product', function () {
        productSet(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubSetReadyToOrder.calledOnce);
    });

    it('should not call bundleReadyToOrder for set product', function () {
        productSet(object, productMock, optionsMock);

        assert.isFalse(decorators.stubs.stubBundleReadyToOrder.calledOnce);
    });

    it('should not call readyToOrder for set product', function () {
        productSet(object, productMock, optionsMock);

        assert.isFalse(decorators.stubs.stubReadyToOrder.calledOnce);
    });
});
