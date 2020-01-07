'use strict';

var assert = require('chai').assert;

var lineItemMock = {
    shipment: {
        UUID: 'someUUID'
    }
};

describe('product line item shipment decorator', function () {
    var shipmentUUID = require('../../../../../../cartridges/app_storefront_base/cartridge/models/productLineItem/decorators/shipment');

    it('should create shipmentUUID property for passed in object', function () {
        var object = {};
        shipmentUUID(object, lineItemMock);

        assert.equal(object.shipmentUUID, 'someUUID');
    });
});
