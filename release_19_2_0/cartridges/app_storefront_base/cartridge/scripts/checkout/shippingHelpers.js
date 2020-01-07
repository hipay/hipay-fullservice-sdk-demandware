'use strict';

var collections = require('*/cartridge/scripts/util/collections');

var ShippingMgr = require('dw/order/ShippingMgr');

var ShippingModel = require('*/cartridge/models/shipping');

var ShippingMethodModel = require('*/cartridge/models/shipping/shippingMethod');


// Public (class) static model functions

/**
 * Plain JS object that represents a DW Script API dw.order.ShippingMethod object
 * @param {dw.order.Basket} currentBasket - the target Basket object
 * @param {Object} customer - the associated Customer Model object
 * @param {string} containerView - view of the shipping models (order or basket)
 * @returns {dw.util.ArrayList} an array of ShippingModels
 */
function getShippingModels(currentBasket, customer, containerView) {
    var shipments = currentBasket ? currentBasket.getShipments() : null;

    if (!shipments) return [];

    return collections.map(shipments, function (shipment) {
        return new ShippingModel(shipment, null, customer, containerView);
    });
}

/**
 * Retrieve raw address JSON object from request.form
 * @param {Request} req - the DW Request object
 * @returns {Object} - raw JSON representing address form data
 */
function getAddressFromRequest(req) {
    return {
        firstName: req.form.firstName,
        lastName: req.form.lastName,
        address1: req.form.address1,
        address2: req.form.address2,
        city: req.form.city,
        stateCode: req.form.stateCode,
        postalCode: req.form.postalCode,
        countryCode: req.form.countryCode,
        phone: req.form.phone
    };
}

/**
 * Returns the first shipping method (and maybe prevent in store pickup)
 * @param {dw.util.Collection} methods - Applicable methods from ShippingShipmentModel
 * @param {boolean} filterPickupInStore - whether to exclude PUIS method
 * @returns {dw.order.ShippingMethod} - the first shipping method (maybe non-PUIS)
 */
function getFirstApplicableShippingMethod(methods, filterPickupInStore) {
    var method;
    var iterator = methods.iterator();
    while (iterator.hasNext()) {
        method = iterator.next();
        if (!filterPickupInStore || (filterPickupInStore && !method.custom.storePickupEnabled)) {
            break;
        }
    }

    return method;
}

/**
 * Sets the shipping method of the basket's default shipment
 * @param {dw.order.Shipment} shipment - Any shipment for the current basket
 * @param {string} shippingMethodID - The shipping method ID of the desired shipping method
 * @param {dw.util.Collection} shippingMethods - List of applicable shipping methods
 * @param {Object} address - the address
 */
function selectShippingMethod(shipment, shippingMethodID, shippingMethods, address) {
    var applicableShippingMethods;
    var defaultShippingMethod = ShippingMgr.getDefaultShippingMethod();
    var shippingAddress;

    if (address && shipment) {
        shippingAddress = shipment.shippingAddress;

        if (shippingAddress) {
            if (address.stateCode && shippingAddress.stateCode !== address.stateCode) {
                shippingAddress.stateCode = address.stateCode;
            }
            if (address.postalCode && shippingAddress.postalCode !== address.postalCode) {
                shippingAddress.postalCode = address.postalCode;
            }
        }
    }

    var isShipmentSet = false;

    if (shippingMethods) {
        applicableShippingMethods = shippingMethods;
    } else {
        var shipmentModel = ShippingMgr.getShipmentShippingModel(shipment);
        applicableShippingMethods = address ? shipmentModel.getApplicableShippingMethods(address) :
            shipmentModel.applicableShippingMethods;
    }

    if (shippingMethodID) {
        // loop through the shipping methods to get shipping method
        var iterator = applicableShippingMethods.iterator();
        while (iterator.hasNext()) {
            var shippingMethod = iterator.next();
            if (shippingMethod.ID === shippingMethodID) {
                shipment.setShippingMethod(shippingMethod);
                isShipmentSet = true;
                break;
            }
        }
    }

    if (!isShipmentSet) {
        if (collections.find(applicableShippingMethods, function (sMethod) {
            return sMethod.ID === defaultShippingMethod.ID;
        })) {
            shipment.setShippingMethod(defaultShippingMethod);
        } else if (applicableShippingMethods.length > 0) {
            var firstMethod = getFirstApplicableShippingMethod(applicableShippingMethods, true);
            shipment.setShippingMethod(firstMethod);
        } else {
            shipment.setShippingMethod(null);
        }
    }
}

/**
 * Sets the default ShippingMethod for a Shipment, if absent
 * @param {dw.order.Shipment} shipment - the target Shipment object
 */
function ensureShipmentHasMethod(shipment) {
    var shippingMethod = shipment.shippingMethod;
    if (!shippingMethod) {
        var methods = ShippingMgr.getShipmentShippingModel(shipment).applicableShippingMethods;
        var defaultMethod = ShippingMgr.getDefaultShippingMethod();

        if (!defaultMethod) {
            // If no defaultMethod set, just use the first one
            shippingMethod = getFirstApplicableShippingMethod(methods, true);
        } else {
            // Look for defaultMethod in applicableMethods
            shippingMethod = collections.find(methods, function (method) {
                return method.ID === defaultMethod.ID;
            });
        }

        // If found, use it.  Otherwise return the first one
        if (!shippingMethod && methods && methods.length > 0) {
            shippingMethod = getFirstApplicableShippingMethod(methods, true);
        }

        if (shippingMethod) {
            shipment.setShippingMethod(shippingMethod);
        }
    }
}

/**
 * Plain JS object that represents a DW Script API dw.order.ShippingMethod object
 * @param {dw.order.Basket} basket - the target Basket
 * @param {string} uuid - the matching UUID to match against Shipments
 * @returns {dw.order.Shipment} a Shipment object
 */
function getShipmentByUUID(basket, uuid) {
    return collections.find(basket.shipments, function (shipment) {
        return shipment.UUID === uuid;
    });
}

/**
 * Plain JS object that represents a DW Script API dw.order.ShippingMethod object
 * @param {dw.order.Shipment} shipment - the target Shipment
 * @param {Object} [address] - optional address object
 * @returns {dw.util.Collection} an array of ShippingModels
 */
function getApplicableShippingMethods(shipment, address) {
    if (!shipment) return null;

    var shipmentShippingModel = ShippingMgr.getShipmentShippingModel(shipment);

    var shippingMethods;
    if (address) {
        shippingMethods = shipmentShippingModel.getApplicableShippingMethods(address);
    } else {
        shippingMethods = shipmentShippingModel.getApplicableShippingMethods();
    }

    // Filter out whatever the method associated with in store pickup
    var filteredMethods = [];
    collections.forEach(shippingMethods, function (shippingMethod) {
        if (!shippingMethod.custom.storePickupEnabled) {
            filteredMethods.push(new ShippingMethodModel(shippingMethod, shipment));
        }
    });

    return filteredMethods;
}

module.exports = {
    getShippingModels: getShippingModels,
    selectShippingMethod: selectShippingMethod,
    ensureShipmentHasMethod: ensureShipmentHasMethod,
    getShipmentByUUID: getShipmentByUUID,
    getAddressFromRequest: getAddressFromRequest,
    getApplicableShippingMethods: getApplicableShippingMethods
};
