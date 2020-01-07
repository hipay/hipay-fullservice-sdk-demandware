'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var stockLevels = {
    inStock: {
        value: 2
    },
    preorder: {
        value: 0
    },
    backorder: {
        value: 0
    },
    notAvailable: {
        value: 0
    }
};

var availabilityModelMock = {
    getAvailabilityLevels: function () {
        return stockLevels;
    },
    inventoryRecord: {
        inStockDate: {
            toDateString: function () {
                return 'some date';
            }
        }
    },
    isOrderable: function () {
        return true;
    }
};

describe('product availability decorator', function () {
    var availability = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/product/decorators/availability', {
        'dw/web/Resource': {
            msgf: function (params) { return params; },
            msg: function (params) { return params; }
        }
    });

    it('should receive product in stock availability message', function () {
        var object = {};
        availability(object, 2, 2, availabilityModelMock);

        assert.equal(object.availability.messages.length, 1);
        assert.equal(object.availability.messages[0], 'label.instock');
        assert.equal(object.availability.inStockDate, 'some date');
    });

    it('should receive product pre order stock availability message', function () {
        var object = {};
        stockLevels.inStock.value = 0;
        stockLevels.preorder.value = 2;
        availability(object, null, 2, availabilityModelMock);

        assert.equal(object.availability.messages.length, 1);
        assert.equal(object.availability.messages[0], 'label.preorder');
    });

    it('should receive product back order stock availability message', function () {
        var object = {};
        stockLevels.inStock.value = 0;
        stockLevels.preorder.value = 0;
        stockLevels.backorder.value = 2;

        availability(object, 2, 2, availabilityModelMock);

        assert.equal(object.availability.messages.length, 1);
        assert.equal(object.availability.messages[0], 'label.back.order');
    });

    it('should receive product not available message', function () {
        var object = {};
        stockLevels.inStock.value = 0;
        stockLevels.preorder.value = 0;
        stockLevels.backorder.value = 0;
        stockLevels.notAvailable.value = 2;

        availability(object, 2, 2, availabilityModelMock);

        assert.equal(object.availability.messages.length, 1);
        assert.equal(object.availability.messages[0], 'label.not.available');
    });

    it('should receive in stock and not available messages', function () {
        var object = {};
        stockLevels.inStock.value = 1;
        stockLevels.preorder.value = 0;
        stockLevels.backorder.value = 0;
        stockLevels.notAvailable.value = 1;

        availability(object, 2, 2, availabilityModelMock);

        assert.equal(object.availability.messages.length, 2);
        assert.equal(object.availability.messages[0], 'label.quantity.in.stock');
        assert.equal(object.availability.messages[1], 'label.not.available.items');
    });

    it('should receive in stock and pre order messages', function () {
        var object = {};
        stockLevels.inStock.value = 1;
        stockLevels.preorder.value = 1;
        stockLevels.backorder.value = 0;
        stockLevels.notAvailable.value = 0;

        availability(object, 2, 2, availabilityModelMock);

        assert.equal(object.availability.messages.length, 2);
        assert.equal(object.availability.messages[0], 'label.quantity.in.stock');
        assert.equal(object.availability.messages[1], 'label.preorder.items');
    });

    it('should receive in stock and back order messages', function () {
        var object = {};
        stockLevels.inStock.value = 1;
        stockLevels.preorder.value = 0;
        stockLevels.backorder.value = 1;
        stockLevels.notAvailable.value = 0;

        availability(object, 2, 2, availabilityModelMock);

        assert.equal(object.availability.messages.length, 2);
        assert.equal(object.availability.messages[0], 'label.quantity.in.stock');
        assert.equal(object.availability.messages[1], 'label.back.order.items');
    });

    it('should receive in stock date null', function () {
        var object = {};
        availabilityModelMock.inventoryRecord = null;

        availability(object, 2, 2, availabilityModelMock);

        assert.equal(object.availability.inStockDate, null);
    });

    it('should receive in available true', function () {
        var object = {};
        availability(object, 2, 2, availabilityModelMock);

        assert.isTrue(object.available);
    });
});
