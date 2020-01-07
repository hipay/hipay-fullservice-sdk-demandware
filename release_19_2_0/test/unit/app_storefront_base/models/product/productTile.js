'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var sinon = require('sinon');

var stubSearchModel = sinon.stub();
stubSearchModel.returns({
    setSearchPhrase: function () {},
    search: function () {},
    getProductSearchHit: function () {},
    getProductSearchHits: function () {
        return {
            next: function () {
                return { firstRepresentedProductID: 'someID' };
            }
        };
    },
    count: 1
});

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

describe('Product Tile Model', function () {
    var decorators = require('../../../../mocks/productDecoratorsMock');

    var productTile = proxyquire('../../../../../cartridges/app_storefront_base/cartridge/models/product/productTile', {
        '*/cartridge/models/product/decorators/index': decorators.mocks,
        '*/cartridge/scripts/util/promotionCache': {
            promotions: []
        },
        'dw/catalog/ProductSearchModel': stubSearchModel
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

    it('should call base for product tile', function () {
        productTile(object, productMock);

        assert.isTrue(decorators.stubs.stubBase.calledOnce);
    });

    it('should call searchPrice for product tile', function () {
        productTile(object, productMock);

        assert.isTrue(decorators.stubs.stubSearchPrice.calledOnce);
    });

    it('should call images for product tile', function () {
        productTile(object, productMock);

        assert.isTrue(decorators.stubs.stubImages.calledOnce);
    });

    it('should call ratings for product tile', function () {
        productTile(object, productMock);

        assert.isTrue(decorators.stubs.stubRatings.calledOnce);
    });

    it('should call searchVariationAttributes for product tile', function () {
        productTile(object, productMock);

        assert.isTrue(decorators.stubs.stubSearchVariationAttributes.calledOnce);
    });

    it('should call searchVariationAttributes for product tile', function () {
        stubSearchModel.returns({
            setSearchPhrase: function () {},
            search: function () {},
            getProductSearchHit: function () { return {}; },
            getProductSearchHits: function () {
                return {
                    next: function () {
                        return { firstRepresentedProductID: 'someID' };
                    }
                };
            },
            count: 0
        });
        productTile(object, productMock);

        assert.isTrue(decorators.stubs.stubSearchVariationAttributes.calledOnce);
    });

    it('should call searchVariationAttributes for product tile', function () {
        stubSearchModel.returns({
            setSearchPhrase: function () {},
            search: function () {},
            getProductSearchHit: function () {},
            getProductSearchHits: function () {
                return {
                    next: function () {
                        return { firstRepresentedProductID: 'someOtherID' };
                    }
                };
            },
            count: 0
        });
        productTile(object, productMock);

        assert.isTrue(decorators.stubs.stubSearchVariationAttributes.calledOnce);
    });
});
