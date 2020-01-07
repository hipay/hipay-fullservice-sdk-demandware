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
    variables: []
};

var object = {};

describe('Bonus Order Line Item', function () {
    var productDecorators = require('../../../../mocks/productDecoratorsMock');
    var productLineItemDecorators = require('../../../../mocks/productLineItemDecoratorsMock');

    var bonusOrderLineItem = proxyquire('../../../../../cartridges/app_storefront_base/cartridge/models/productLineItem/bonusOrderLineItem', {
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
        productLineItemDecorators.stubs.stubQuantityOptions.reset();
        productLineItemDecorators.stubs.stubOptions.reset();
        productLineItemDecorators.stubs.stubBundledProductLineItems.reset();
        productLineItemDecorators.stubs.stubBonusProductLineItemUUID.reset();
        productLineItemDecorators.stubs.stubPreOrderUUID.reset();
        productLineItemDecorators.stubs.stubBonusUnitPrice.reset();
    });

    it('should call base for bonus line item model (order)', function () {
        bonusOrderLineItem(object, productMock, optionsMock);

        assert.isTrue(productDecorators.stubs.stubBase.calledOnce);
    });

    it('should not call price for bonus line item model  (order)', function () {
        bonusOrderLineItem(object, productMock, optionsMock);

        assert.isFalse(productDecorators.stubs.stubPrice.calledOnce);
    });

    it('should call images for bonus line item model (order)', function () {
        bonusOrderLineItem(object, productMock, optionsMock);

        assert.isTrue(productDecorators.stubs.stubImages.calledOnce);
    });

    it('should call variationAttributes for bonus line item model (order)', function () {
        bonusOrderLineItem(object, productMock, optionsMock);

        assert.isTrue(productDecorators.stubs.stubVariationAttributes.calledOnce);
    });

    it('should not call availability for bonus line item model (order)', function () {
        bonusOrderLineItem(object, productMock, optionsMock);

        assert.isFalse(productDecorators.stubs.stubAvailability.calledOnce);
    });

    it('should call quantity for bonus line item model (order)', function () {
        bonusOrderLineItem(object, productMock, optionsMock);

        assert.isTrue(productLineItemDecorators.stubs.stubQuantity.calledOnce);
    });

    it('should not call gift for bonus line item model (order)', function () {
        bonusOrderLineItem(object, productMock, optionsMock);

        assert.isFalse(productLineItemDecorators.stubs.stubGift.calledOnce);
    });

    it('should not call appliedPromotions for bonus line item model (order)', function () {
        bonusOrderLineItem(object, productMock, optionsMock);

        assert.isFalse(productLineItemDecorators.stubs.stubAppliedPromotions.calledOnce);
    });

    it('should not call renderedPromotions for bonus line item model (order)', function () {
        bonusOrderLineItem(object, productMock, optionsMock);

        assert.isFalse(productLineItemDecorators.stubs.stubRenderedPromotions.calledOnce);
    });

    it('should call uuid for bonus line item model (order)', function () {
        bonusOrderLineItem(object, productMock, optionsMock);

        assert.isTrue(productLineItemDecorators.stubs.stubUuid.calledOnce);
    });

    it('should call orderable for bonus line item model (order)', function () {
        bonusOrderLineItem(object, productMock, optionsMock);

        assert.isTrue(productLineItemDecorators.stubs.stubOrderable.calledOnce);
    });

    it('should call shipment for bonus line item model (order)', function () {
        bonusOrderLineItem(object, productMock, optionsMock);

        assert.isTrue(productLineItemDecorators.stubs.stubShipment.calledOnce);
    });

    it('should not call bonusProductLineItem for bonus line item model (order)', function () {
        bonusOrderLineItem(object, productMock, optionsMock);

        assert.isFalse(productLineItemDecorators.stubs.stubBonusProductLineItem.calledOnce);
    });

    it('should call priceTotal for bonus line item model (order)', function () {
        bonusOrderLineItem(object, productMock, optionsMock);

        assert.isTrue(productLineItemDecorators.stubs.stubPriceTotal.calledOnce);
    });

    it('should not call quantityOptions for bonus line item model (order)', function () {
        bonusOrderLineItem(object, productMock, optionsMock);

        assert.isFalse(productLineItemDecorators.stubs.stubQuantityOptions.calledOnce);
    });

    it('should call options for bonus line item model (order)', function () {
        bonusOrderLineItem(object, productMock, optionsMock);

        assert.isTrue(productLineItemDecorators.stubs.stubOptions.calledOnce);
    });

    it('should not call bundledProductLineItems for bonus line item model (order)', function () {
        bonusOrderLineItem(object, productMock, optionsMock);

        assert.isFalse(productLineItemDecorators.stubs.stubBundledProductLineItems.calledOnce);
    });

    it('should call bonusProductLineItemUUID for bonus line item model (order)', function () {
        bonusOrderLineItem(object, productMock, optionsMock);

        assert.isTrue(productLineItemDecorators.stubs.stubBonusProductLineItemUUID.calledOnce);
    });

    it('should call preOrderUUID for bonus line item model (order)', function () {
        bonusOrderLineItem(object, productMock, optionsMock);

        assert.isTrue(productLineItemDecorators.stubs.stubPreOrderUUID.calledOnce);
    });

    it('should not call bonusUnitPrice for bonus line item model (order)', function () {
        bonusOrderLineItem(object, productMock, optionsMock);

        assert.isFalse(productLineItemDecorators.stubs.stubBonusUnitPrice.calledOnce);
    });
});
