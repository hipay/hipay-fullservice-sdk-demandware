'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var quantityOptions = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/productLineItem/decorators/quantityOptions', {
    'dw/catalog/ProductInventoryMgr': require('../../../../../mocks/dw/catalog/ProductInventoryMgr'),
    '*/cartridge/config/preferences': require('../../../../../mocks/config/preferences')
});

describe('product line item quantity options decorator', function () {
    describe('When no inventory list provided', function () {
        var productLineItemMock = {
            product: {
                availabilityModel: {
                    inventoryRecord: {
                        ATS: {
                            value: 5
                        }
                    }
                },
                minOrderQuantity: {
                    value: 1
                }
            }
        };

        it('should create quantityOptions property for passed in object', function () {
            var object = {};
            quantityOptions(object, productLineItemMock, 1);

            assert.equal(object.quantityOptions.minOrderQuantity, 1);
            assert.equal(object.quantityOptions.maxOrderQuantity, 5);
        });

        it('should handle no minOrderQuantity on the product', function () {
            var object = {};
            productLineItemMock.product.minOrderQuantity.value = null;
            quantityOptions(object, productLineItemMock, 1);

            assert.equal(object.quantityOptions.minOrderQuantity, 1);
            assert.equal(object.quantityOptions.maxOrderQuantity, 5);
        });
    });

    describe('When inventory list provided', function () {
        it('should return inventory of the specified productInventoryListID', function () {
            var productLineItemMock = {
                product: {
                    availabilityModel: {
                        inventoryRecord: {
                            ATS: {
                                value: 5
                            }
                        }
                    },
                    minOrderQuantity: {
                        value: 2
                    },
                    ID: '000002'
                },
                productInventoryListID: 'inventoryListId0001'
            };

            var object = {};
            quantityOptions(object, productLineItemMock, 1);

            assert.equal(object.quantityOptions.minOrderQuantity, 2);
            assert.equal(object.quantityOptions.maxOrderQuantity, 3);
        });
    });
});
