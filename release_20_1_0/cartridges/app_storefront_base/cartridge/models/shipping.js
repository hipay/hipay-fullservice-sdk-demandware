'use strict';

var AddressModel = require('*/cartridge/models/address');
var ProductLineItemsModel = require('*/cartridge/models/productLineItems');
var ShippingMethodModel = require('*/cartridge/models/shipping/shippingMethod');


/**
 * Plain JS object that represents a DW Script API dw.order.ShippingMethod object
 * @param {dw.order.Shipment} shipment - the target Shipment
 * @param {string} containerView - the view of the product line items (order or basket)
 * @returns {ProductLineItemsModel} an array of ShippingModels
 */
function getProductLineItemsModel(shipment, containerView) {
    if (!shipment) return null;

    return new ProductLineItemsModel(shipment.productLineItems, containerView);
}

/**
 * Plain JS object that represents a DW Script API dw.order.ShippingMethod object
 * @param {dw.order.Shipment} shipment - the target Shipment
 * @returns {Object} a ShippingMethodModel object
 */
function getSelectedShippingMethod(shipment) {
    if (!shipment) return null;

    var method = shipment.shippingMethod;

    return method ? new ShippingMethodModel(method, shipment) : null;
}

/**
 * ppingMethod object
 * @param {dw.order.Shipment} shipment - the target Shipment
 * @returns {string} the Shipment UUID or null
 */
function getShipmentUUID(shipment) {
    if (!shipment) return null;

    return shipment.UUID;
}

/**
 * Returns the matching address ID or UUID for a shipping address
 * @param {dw.order.Shipment} shipment - line items model
 * @param {Object} customer - customer model
 * @return {string|boolean} returns matching ID or false
*/
function getAssociatedAddress(shipment, customer) {
    var address = shipment ? shipment.shippingAddress : null;
    var matchingId;
    var anAddress;

    if (!address) return false;

    // If we still haven't found a match, then loop through customer addresses to find a match
    if (!matchingId && customer && customer.addressBook && customer.addressBook.addresses) {
        for (var j = 0, jj = customer.addressBook.addresses.length; j < jj; j++) {
            anAddress = customer.addressBook.addresses[j];

            if (anAddress && anAddress.isEquivalentAddress(address)) {
                matchingId = anAddress.ID;
                break;
            }
        }
    }

    return matchingId;
}

/**
 * Returns a boolean indicating if the address is empty
 * @param {dw.order.Shipment} shipment - A shipment from the current basket
 * @returns {boolean} a boolean that indicates if the address is empty
 */
function emptyAddress(shipment) {
    if (shipment && shipment.shippingAddress) {
        return ['firstName', 'lastName', 'address1', 'address2', 'phone', 'city', 'postalCode', 'stateCode'].some(function (key) {
            return shipment.shippingAddress[key];
        });
    }
    return false;
}

/**
 * @constructor
 * @classdesc Model that represents shipping information
 *
 * @param {dw.order.Shipment} shipment - the default shipment of the current basket
 * @param {Object} address - the address to use to filter the shipping method list
 * @param {Object} customer - the current customer model
 * @param {string} containerView - the view of the product line items (order or basket)
 */
function ShippingModel(shipment, address, customer, containerView) {
    var shippingHelpers = require('*/cartridge/scripts/checkout/shippingHelpers');

    // Simple properties
    this.UUID = getShipmentUUID(shipment);

    // Derived properties
    this.productLineItems = getProductLineItemsModel(shipment, containerView);
    this.applicableShippingMethods = shippingHelpers.getApplicableShippingMethods(shipment, address);
    this.selectedShippingMethod = getSelectedShippingMethod(shipment);
    this.matchingAddressId = getAssociatedAddress(shipment, customer);

    // Optional properties
    if (emptyAddress(shipment)) {
        this.shippingAddress = new AddressModel(shipment.shippingAddress).address;
    } else {
        this.shippingAddress = address;
    }

    this.isGift = shipment ? shipment.gift : null;
    this.giftMessage = shipment ? shipment.giftMessage : null;
}

module.exports = ShippingModel;
