'use strict';

var ShippingMgr = require('dw/order/ShippingMgr');

var formatCurrency = require('*/cartridge/scripts/util/formatting').formatCurrency;

/**
 * Returns shippingCost property for a specific Shipment / ShippingMethod pair
 * @param {dw.order.ShippingMethod} shippingMethod - the default shipment of the current basket
 * @param {dw.order.Shipment} shipment - a shipment of the current basket
 * @returns {string} String representation of Shipping Cost
 */
function getShippingCost(shippingMethod, shipment) {
    var shipmentShippingModel = ShippingMgr.getShipmentShippingModel(shipment);
    var shippingCost = shipmentShippingModel.getShippingCost(shippingMethod);

    return formatCurrency(shippingCost.amount.value, shippingCost.amount.currencyCode);
}

/**
 * Returns isSelected property for a specific Shipment / ShippingMethod pair
 * @param {dw.order.ShippingMethod} shippingMethod - the default shipment of the current basket
 * @param {dw.order.Shipment} shipment - a shipment of the current basket
 * @returns {boolean} true is shippingMethod is selected in Shipment
 */
function getIsSelected(shippingMethod, shipment) {
    var selectedShippingMethod = shipment.shippingMethod || ShippingMgr.getDefaultShippingMethod();
    var selectedShippingMethodID = selectedShippingMethod ? selectedShippingMethod.ID : null;

    return (selectedShippingMethodID && shippingMethod.ID === selectedShippingMethodID);
}


/**
 * Plain JS object that represents a DW Script API dw.order.ShippingMethod object
 * @param {dw.order.ShippingMethod} shippingMethod - the default shipment of the current basket
 * @param {dw.order.Shipment} [shipment] - a Shipment
 */
function ShippingMethodModel(shippingMethod, shipment) {
    this.ID = shippingMethod ? shippingMethod.ID : null;
    this.displayName = shippingMethod ? shippingMethod.displayName : null;
    this.description = shippingMethod ? shippingMethod.description : null;
    this.estimatedArrivalTime = shippingMethod && shippingMethod.custom
        ? shippingMethod.custom.estimatedArrivalTime : null;
    this.default = shippingMethod ? shippingMethod.defaultMethod : null;

    // Mix in dynamically transformed properties
    if (shipment) {
        // Optional model information available with 'shipment' parameter
        this.shippingCost = getShippingCost(shippingMethod, shipment);
        this.selected = getIsSelected(shippingMethod, shipment);
    }
}

module.exports = ShippingMethodModel;
