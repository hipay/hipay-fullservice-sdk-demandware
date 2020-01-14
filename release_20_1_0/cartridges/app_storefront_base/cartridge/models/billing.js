'use strict';

/**
* Billing class that represent billing information for the current basket
* @param {Object} addressModel - the billing address of the current basket
* @param {Object} paymentModel - payment information for the current basket
* @param {string} associatedAddressId - the matching ID of the shipping or customer address
* @constructor
*/
function billing(addressModel, paymentModel, associatedAddressId) {
    this.billingAddress = addressModel;
    this.payment = paymentModel;
    this.matchingAddressId = associatedAddressId;
}

module.exports = billing;
