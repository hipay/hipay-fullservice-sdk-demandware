'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var ArrayList = require('../../../../mocks/dw.util.Collection');
var checkoutHelpers = require('../../../../mocks/helpers/checkoutHelpers');

var productLineItems1 = new ArrayList([{
    product: {
        online: true,
        availabilityModel: {
            getAvailabilityLevels: function () {
                return {
                    notAvailable: {
                        value: 0
                    }
                };
            }
        }
    },
    custom: {},
    productID: 'someID',
    quantityValue: 2
}]);

var productLineItems2 = new ArrayList([{
    product: {
        online: false,
        availabilityModel: {
            getAvailabilityLevels: function () {
                return {
                    notAvailable: {
                        value: 0
                    }
                };
            }
        }
    },
    custom: {},
    productID: 'someID',
    quantityValue: 2
}]);

var productLineItems3 = new ArrayList([{
    product: {
        online: true,
        availabilityModel: {
            getAvailabilityLevels: function () {
                return {
                    notAvailable: {
                        value: 0
                    }
                };
            }
        }
    },
    custom: {
        fromStoreId: new ArrayList([{}])
    },
    productID: 'someID',
    quantityValue: 2
}]);

var lineItemContainer = {
    totalTax: {
        available: false
    },
    merchandizeTotalPrice: {
        available: true
    },
    productLineItems: productLineItems1,
    couponLineItems: new ArrayList([{
        valid: true
    }])
};

describe('basket validation helpers', function () {
    var basketValidationHelpers = proxyquire('../../../../../cartridges/app_storefront_base/cartridge/scripts/helpers/basketValidationHelpers', {
        'dw/catalog/ProductInventoryMgr': {
            getInventoryList: function () {
                return {
                    getRecord: function () {
                        return {
                            ATS: {
                                value: 3
                            }
                        };
                    }
                };
            }
        },
        'dw/web/Resource': {
            msg: function (param) {
                return param;
            }
        },
        '*/cartridge/scripts/util/collections': proxyquire('../../../../../cartridges/app_storefront_base/cartridge/scripts/util/collections', {
            'dw/util/ArrayList': ArrayList
        }),
        'dw/catalog/StoreMgr': {
            getStore: function () {
                return {
                    custom: {
                        inventoryListId: 'someID'
                    }
                };
            }
        },
        '*/cartridge/scripts/checkout/checkoutHelpers': checkoutHelpers
    });

    it('should validate a basket', function () {
        var result = basketValidationHelpers.validateProducts(lineItemContainer);
        assert.isFalse(result.error);
        assert.equal(result.message, null);
    });

    it('should invalidate a basket when product not online', function () {
        lineItemContainer.productLineItems = productLineItems2;
        var result = basketValidationHelpers.validateProducts(lineItemContainer);
        assert.isTrue(result.error);
        lineItemContainer.productLineItems = productLineItems1;
    });

    it('should validate a basket when product has inStore inventory', function () {
        lineItemContainer.productLineItems = productLineItems3;
        var result = basketValidationHelpers.validateProducts(lineItemContainer);
        assert.isFalse(result.error);
        lineItemContainer.productLineItems = productLineItems1;
    });

    it('should invalidate a basket with invalid coupons', function () {
        lineItemContainer.couponLineItems = new ArrayList([{ valid: false }]);
        var result = basketValidationHelpers.validateCoupons(lineItemContainer);
        assert.isTrue(result.error);
        lineItemContainer.couponLineItems = new ArrayList([{ valid: true }]);
    });

    it('should invalidate a basket with invalid shipments', function () {
        lineItemContainer.shipments = new ArrayList([{ shippingAddress: {} }]);
        var result = basketValidationHelpers.validateShipments(lineItemContainer);
        assert.isFalse(result);
    });

    it('should validate a basket with valid shipments', function () {
        lineItemContainer.shipments = new ArrayList([{ shippingAddress: { address1: 'some street' } }]);
        var result = basketValidationHelpers.validateShipments(lineItemContainer);
        assert.isTrue(result);
    });
});
