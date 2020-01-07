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
    ID: 'someID'
};

var optionsMock = {
    productType: 'someProductType',
    optionModel: {},
    quantity: 1,
    variationModel: {},
    promotions: [],
    variables: [],
    lineItem: { UUID: '123' }
};

var object = {};

describe('Order Line Item Model', function () {
    var productDecorators = require('../../../../mocks/productDecoratorsMock');
    var productLineItemDecorators = require('../../../../mocks/productLineItemDecoratorsMock');

    var orderLineItem = proxyquire('../../../../../cartridges/app_storefront_base/cartridge/models/productLineItem/orderLineItem', {
        '*/cartridge/models/product/decorators/index': productDecorators.mocks,
        '*/cartridge/models/productLineItem/decorators/index': productLineItemDecorators.mocks
    });

    afterEach(function () {
        productDecorators.stubs.stubBase.reset();
        productDecorators.stubs.stubPrice.reset();
        productDecorators.stubs.stubImages.reset();
        productDecorators.stubs.stubAvailability.reset();
        productDecorators.stubs.stubDescription.reset();
        productDecorators.stubs.stubSearchPrice.reset();
        productDecorators.stubs.stubPromotions.reset();
        productDecorators.stubs.stubQuantity.reset();
        productDecorators.stubs.stubQuantitySelector.reset();
        productDecorators.stubs.stubRatings.reset();
        productDecorators.stubs.stubSizeChart.reset();
        productDecorators.stubs.stubVariationAttributes.reset();
        productDecorators.stubs.stubSearchVariationAttributes.reset();
        productDecorators.stubs.stubAttributes.reset();
        productDecorators.stubs.stubOptions.reset();
        productDecorators.stubs.stubCurrentUrl.reset();
        productDecorators.stubs.stubReadyToOrder.reset();
        productDecorators.stubs.stubSetReadyToOrder.reset();
        productDecorators.stubs.stubBundleReadyToOrder.reset();
        productDecorators.stubs.stubSetIndividualProducts.reset();
        productDecorators.stubs.stubBundledProducts.reset();
        productLineItemDecorators.stubs.stubQuantity.reset();
        productLineItemDecorators.stubs.stubGift.reset();
        productLineItemDecorators.stubs.stubAppliedPromotions.reset();
        productLineItemDecorators.stubs.stubRenderedPromotions.reset();
        productLineItemDecorators.stubs.stubUuid.reset();
        productLineItemDecorators.stubs.stubOrderable.reset();
        productLineItemDecorators.stubs.stubShipment.reset();
        productLineItemDecorators.stubs.stubBonusProductLineItem.reset();
        productLineItemDecorators.stubs.stubPriceTotal.reset();
        productLineItemDecorators.stubs.stubOptions.reset();
    });

    it('should call base for order line item model', function () {
        orderLineItem(object, productMock, optionsMock);

        assert.isTrue(productDecorators.stubs.stubBase.calledOnce);
    });

    it('should not call price for order line item model', function () {
        orderLineItem(object, productMock, optionsMock);

        assert.isFalse(productDecorators.stubs.stubPrice.calledOnce);
    });

    it('should call images for order line item model', function () {
        orderLineItem(object, productMock, optionsMock);

        assert.isTrue(productDecorators.stubs.stubImages.calledOnce);
    });

    it('should call variationAttributes for order line item model', function () {
        orderLineItem(object, productMock, optionsMock);

        assert.isTrue(productDecorators.stubs.stubVariationAttributes.calledOnce);
    });


    it('should call quantity for order line item model', function () {
        orderLineItem(object, productMock, optionsMock);

        assert.isTrue(productLineItemDecorators.stubs.stubQuantity.calledOnce);
    });

    it('should call gift for order line item model', function () {
        orderLineItem(object, productMock, optionsMock);

        assert.isTrue(productLineItemDecorators.stubs.stubGift.calledOnce);
    });

    it('should call appliedPromotions for order line item model', function () {
        orderLineItem(object, productMock, optionsMock);

        assert.isTrue(productLineItemDecorators.stubs.stubAppliedPromotions.calledOnce);
    });

    it('should call renderedPromotions for order line item model', function () {
        orderLineItem(object, productMock, optionsMock);

        assert.isTrue(productLineItemDecorators.stubs.stubRenderedPromotions.calledOnce);
    });

    it('should call uuid for order line item model', function () {
        orderLineItem(object, productMock, optionsMock);

        assert.isTrue(productLineItemDecorators.stubs.stubUuid.calledOnce);
    });

    it('should call shipment for order line item model', function () {
        orderLineItem(object, productMock, optionsMock);

        assert.isTrue(productLineItemDecorators.stubs.stubShipment.calledOnce);
    });

    it('should call bonusOderLineItem for order line item model', function () {
        orderLineItem(object, productMock, optionsMock);

        assert.isTrue(productLineItemDecorators.stubs.stubBonusProductLineItem.calledOnce);
    });

    it('should call priceTotal for order line item model', function () {
        orderLineItem(object, productMock, optionsMock);

        assert.isTrue(productLineItemDecorators.stubs.stubPriceTotal.calledOnce);
    });

    it('should call options for order line item model', function () {
        orderLineItem(object, productMock, optionsMock);

        assert.isTrue(productLineItemDecorators.stubs.stubOptions.calledOnce);
    });
});
