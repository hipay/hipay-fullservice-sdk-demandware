'use strict';

module.exports = function (object, lineItem) {
    Object.defineProperty(object, 'shipmentUUID', {
        enumerable: true,
        value: lineItem.shipment.UUID
    });
};
