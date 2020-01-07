'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

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
    ID: 'someID',
    pageTitle: 'some title',
    pageDescription: 'some description',
    pageKeywords: 'some keywords',
    pageMetaData: [{}],
    template: 'some template'
};

var optionsMock = {
    productType: 'someProductType',
    optionModel: {},
    quantity: 1,
    variationModel: {},
    promotions: [],
    variables: []
};

describe('Full Product Model', function () {
    var decorators = require('../../../../mocks/productDecoratorsMock');

    var fullProduct = proxyquire('../../../../../cartridges/app_storefront_base/cartridge/models/product/fullProduct', {
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
        decorators.stubs.stubOnline.reset();
        decorators.stubs.stubSetReadyToOrder.reset();
        decorators.stubs.stubBundleReadyToOrder.reset();
        decorators.stubs.stubSetIndividualProducts.reset();
        decorators.stubs.stubBundledProducts.reset();
        decorators.stubs.stubBonusUnitPrice.reset();
        decorators.stubs.stubPageMetaData.reset();
        decorators.stubs.stubTemplate.reset();
    });

    it('should call base for full product', function () {
        var object = {};
        fullProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubBase.calledOnce);
    });

    it('should call price for full product', function () {
        var object = {};
        fullProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubPrice.calledOnce);
    });

    it('should call images for full product', function () {
        var object = {};
        fullProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubImages.calledWith(object, optionsMock.variationModel));
    });

    it('should call images for full product when there is no variation model', function () {
        var object = {};
        optionsMock.variationModel = null;
        fullProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubImages.calledWith(object, productMock));
    });

    it('should call quantity for full product', function () {
        var object = {};
        fullProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubQuantity.calledOnce);
    });

    it('should call variationAttributes for full product', function () {
        var object = {};
        fullProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubVariationAttributes.calledOnce);
    });

    it('should call description for full product', function () {
        var object = {};
        fullProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubDescription.calledOnce);
    });

    it('should call ratings for full product', function () {
        var object = {};
        fullProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubRatings.calledOnce);
    });

    it('should call promotion for full product', function () {
        var object = {};
        fullProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubPromotions.calledOnce);
    });

    it('should call attributes for full product', function () {
        var object = {};
        fullProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubAttributes.calledOnce);
    });

    it('should call availability for full product', function () {
        var object = {};
        fullProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubAvailability.calledOnce);
    });

    it('should call options for full product', function () {
        var object = {};
        fullProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubOptions.calledOnce);
    });

    it('should call quantitySelector for full product', function () {
        var object = {};
        fullProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubQuantitySelector.calledOnce);
    });

    it('should call sizeChart for full product', function () {
        var object = {};
        fullProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubSizeChart.calledOnce);
    });

    it('should call currentUrl for full product', function () {
        var object = {};
        fullProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubCurrentUrl.calledOnce);
    });

    it('should not call sizeChart for full product when no primary category for api product', function () {
        var object = {};
        optionsMock.productType = 'master';
        productMock.getPrimaryCategory = function () { return null; };
        fullProduct(object, productMock, optionsMock);

        assert.isFalse(decorators.stubs.stubSizeChart.calledOnce);
    });

    it('should call sizeChart for full product when no primary category for api product', function () {
        var object = {};
        optionsMock.productType = 'variant';
        productMock.getPrimaryCategory = function () { return null; };
        fullProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubSizeChart.calledOnce);
    });

    it('should call readyToOrder for full product', function () {
        var object = {};
        productMock.getPrimaryCategory = function () { return null; };
        fullProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubReadyToOrder.calledOnce);
    });

    it('should call online for full product', function () {
        var object = {};
        productMock.getPrimaryCategory = function () { return null; };
        fullProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubOnline.calledOnce);
    });

    it('should call pageMetaData for full product', function () {
        var object = {};
        productMock.getPrimaryCategory = function () { return null; };
        fullProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubPageMetaData.calledOnce);
    });

    it('should call template for full product', function () {
        var object = {};
        fullProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubTemplate.calledOnce);
    });
});
