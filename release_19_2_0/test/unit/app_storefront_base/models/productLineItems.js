'use strict';

var assert = require('chai').assert;
var ArrayList = require('../../../mocks/dw.util.Collection');
var toProductMock = require('../../../util');

var ProductLineItemsModel = require('../../../mocks/models/productLineItems');

var productVariantMock = {
    ID: '1234567',
    name: 'test product',
    variant: true,
    availabilityModel: {
        isOrderable: {
            return: true,
            type: 'function'
        },
        inventoryRecord: {
            ATS: {
                value: 100
            }
        }
    },
    minOrderQuantity: {
        value: 2
    }
};

var productMock = {
    variationModel: {
        productVariationAttributes: new ArrayList([{
            attributeID: '',
            value: ''
        }]),
        selectedVariant: productVariantMock
    }
};

var apiBasketNoBonusLineItems = {
    productLineItems: new ArrayList([{
        bonusProductLineItem: false,
        gift: false,
        UUID: 'some UUID',
        adjustedPrice: {
            value: 'some value',
            currencyCode: 'US'
        },
        quantity: {
            value: 1
        },
        product: toProductMock(productMock),
        custom: { bonusProductLineItemUUID: '' }
    }])
};

var apiBasketBonusLineItems = {
    productLineItems: new ArrayList([{
        bonusProductLineItem: true,
        gift: false,
        UUID: 'some UUID',
        adjustedPrice: {
            value: 'some value',
            currencyCode: 'US'
        },
        quantity: {
            value: 1
        },
        product: toProductMock(productMock),
        custom: { bonusProductLineItemUUID: '', preOrderUUID: '' }
    },
    {
        bonusProductLineItem: false,
        gift: false,
        UUID: 'some UUID',
        adjustedPrice: {
            value: 'some value',
            currencyCode: 'US'
        },
        quantity: {
            value: 1
        },
        product: toProductMock(productMock),
        custom: { bonusProductLineItemUUID: 'someUUID', preOrderUUID: 'someUUID' },
        optionProductLineItems: new ArrayList([{ optionID: 'someOptionID', optionValueID: 'someIDValue' }])
    }])
};

describe('ProductLineItems model', function () {
    it('should accept/process a null Basket object', function () {
        var lineItems = null;
        var result = new ProductLineItemsModel(lineItems);
        assert.equal(result.items.length, 0);
        assert.equal(result.totalQuantity, 0);
    });

    it('should create product line items and get total quantity', function () {
        var result = new ProductLineItemsModel(apiBasketNoBonusLineItems.productLineItems);
        assert.equal(result.items.length, 1);
        assert.equal(result.totalQuantity, 1);
    });

    it('should create product line items with bonus line items present', function () {
        var result = new ProductLineItemsModel(apiBasketBonusLineItems.productLineItems);
        assert.equal(result.items.length, 2);
        assert.equal(result.totalQuantity, 2);
    });
});
