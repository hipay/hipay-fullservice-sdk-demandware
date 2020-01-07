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

describe('Bonus Product Model Model', function () {
    var decorators = require('../../../../mocks/productDecoratorsMock');

    var bonusProduct = proxyquire('../../../../../cartridges/app_storefront_base/cartridge/models/product/bonusProduct', {
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
        decorators.stubs.stubBonusUnitPrice.reset();
    });

    it('should call base for bonus product', function () {
        bonusProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubBase.calledOnce);
    });

    it('should not call price for bonus product', function () {
        bonusProduct(object, productMock, optionsMock);

        assert.isFalse(decorators.stubs.stubPrice.calledOnce);
    });

    it('should call images for bonus product', function () {
        bonusProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubImages.calledOnce);
    });

    it('should call quantity for bonus product', function () {
        bonusProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubQuantity.calledOnce);
    });

    it('should call variationAttributes for bonus product', function () {
        bonusProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubVariationAttributes.calledOnce);
    });

    it('should not call description for bonus product', function () {
        bonusProduct(object, productMock, optionsMock);

        assert.isFalse(decorators.stubs.stubDescription.calledOnce);
    });

    it('should not call ratings for bonus product', function () {
        bonusProduct(object, productMock, optionsMock);

        assert.isFalse(decorators.stubs.stubRatings.calledOnce);
    });

    it('should not call promotion for bonus product', function () {
        bonusProduct(object, productMock, optionsMock);

        assert.isFalse(decorators.stubs.stubPromotions.calledOnce);
    });

    it('should call attributes for bonus product', function () {
        bonusProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubAttributes.calledOnce);
    });

    it('should call availability for bonus product', function () {
        bonusProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubAvailability.calledOnce);
    });

    it('should call options for bonus product', function () {
        bonusProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubOptions.calledOnce);
    });

    it('should call quantitySelector for bonus product', function () {
        bonusProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubQuantitySelector.calledOnce);
    });

    it('should not call sizeChart for bonus product', function () {
        bonusProduct(object, productMock, optionsMock);

        assert.isFalse(decorators.stubs.stubSizeChart.calledOnce);
    });

    it('should not call currentUrl for bonus product', function () {
        bonusProduct(object, productMock, optionsMock);

        assert.isFalse(decorators.stubs.stubCurrentUrl.calledOnce);
    });

    it('should not call setIndividualProducts for bonus product', function () {
        bonusProduct(object, productMock, optionsMock);

        assert.isFalse(decorators.stubs.stubSetIndividualProducts.calledOnce);
    });

    it('should call setReadyToOrder for bonus product', function () {
        bonusProduct(object, productMock, optionsMock);

        assert.isFalse(decorators.stubs.stubSetReadyToOrder.calledOnce);
    });

    it('should not call bundleReadyToOrder for bonus product', function () {
        bonusProduct(object, productMock, optionsMock);

        assert.isFalse(decorators.stubs.stubBundleReadyToOrder.calledOnce);
    });

    it('should call readyToOrder for bonus product', function () {
        bonusProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubReadyToOrder.calledOnce);
    });

    it('should call bonusUnitPrice for bonus product', function () {
        bonusProduct(object, productMock, optionsMock);

        assert.isTrue(decorators.stubs.stubBonusUnitPrice.calledOnce);
    });
});
