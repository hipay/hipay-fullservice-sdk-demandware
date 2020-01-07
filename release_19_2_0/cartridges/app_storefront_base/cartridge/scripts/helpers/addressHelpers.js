'use strict';

/**
 * Generate address name based on the full address object
 * @param {dw.order.OrderAddress} address - Object that contains shipping address
 * @returns {string} - String with the generated address name
 */
function generateAddressName(address) {
    return [(address.address1 || ''), (address.city || ''), (address.postalCode || '')].join(' - ');
}

/**
 * Verify if the address already exists as a stored user address
 * @param {dw.order.OrderAddress} address - Object that contains shipping address
 * @param {Object[]} storedAddresses - List of stored user addresses
 * @returns {boolean} - Boolean indicating if the address already exists
 */
function checkIfAddressStored(address, storedAddresses) {
    for (var i = 0, l = storedAddresses.length; i < l; i++) {
        if (storedAddresses[i].address1 === address.address1
            && storedAddresses[i].postalCode === address.postalCode
            && storedAddresses[i].firstName === address.firstName
            && storedAddresses[i].lastName === address.lastName) {
            return true;
        }
    }
    return false;
}

/**
 * Copy information from address object and save it in the system
 * @param {dw.customer.CustomerAddress} newAddress - newAddress to save information into
 * @param {*} address - Address to copy from
 */
function updateAddressFields(newAddress, address) {
    newAddress.setAddress1(address.address1 || '');
    newAddress.setAddress2(address.address2 || '');
    newAddress.setCity(address.city || '');
    newAddress.setFirstName(address.firstName || '');
    newAddress.setLastName(address.lastName || '');
    newAddress.setPhone(address.phone || '');
    newAddress.setPostalCode(address.postalCode || '');

    if (address.states && address.states.stateCode) {
        newAddress.setStateCode(address.states.stateCode);
    }

    if (address.country) {
        newAddress.setCountryCode(address.country);
    }

    newAddress.setJobTitle(address.jobTitle || '');
    newAddress.setPostBox(address.postBox || '');
    newAddress.setSalutation(address.salutation || '');
    newAddress.setSecondName(address.secondName || '');
    newAddress.setCompanyName(address.companyName || '');
    newAddress.setSuffix(address.suffix || '');
    newAddress.setSuite(address.suite || '');
    newAddress.setJobTitle(address.title || '');
}

/**
 * Stores a new address for a given customer
 * @param {Object} address - New address to be saved
 * @param {Object} customer - Current customer
 * @param {string} addressId - Id of a new address to be created
 * @returns {void}
 */
function saveAddress(address, customer, addressId) {
    var Transaction = require('dw/system/Transaction');

    var addressBook = customer.raw.getProfile().getAddressBook();
    Transaction.wrap(function () {
        var newAddress = addressBook.createAddress(addressId);
        updateAddressFields(newAddress, address);
    });
}

/**
 * Copy dwscript address object into JavaScript object
 * @param {dw.order.OrderAddress} address - Address to be copied
 * @returns {Object} - Plain object that represents an address
 */
function copyShippingAddress(address) {
    return {
        address1: address.address1,
        address2: address.address2,
        city: address.city,
        firstName: address.firstName,
        lastName: address.lastName,
        phone: address.phone,
        postalCode: address.postalCode,
        states: {
            stateCode: address.stateCode
        },
        country: address.countryCode,
        jobTitle: address.jobTitle,
        postBox: address.postBox,
        salutation: address.salutation,
        secondName: address.secondName,
        companyName: address.companyName,
        suffix: address.suffix,
        suite: address.suite,
        title: address.title
    };
}

/**
 * Gather all addresses from shipments and return as an array
 * @param {dw.order.Basket} order - current order
 * @returns {Array} - Array of shipping addresses
 */
function gatherShippingAddresses(order) {
    var collections = require('*/cartridge/scripts/util/collections');
    var allAddresses = [];

    if (order.shipments) {
        collections.forEach(order.shipments, function (shipment) {
            if (shipment.shippingAddress) {
                allAddresses.push(copyShippingAddress(shipment.shippingAddress));
            }
        });
    } else {
        allAddresses.push(order.defaultShipment.shippingAddress);
    }
    return allAddresses;
}

module.exports = {
    generateAddressName: generateAddressName,
    checkIfAddressStored: checkIfAddressStored,
    saveAddress: saveAddress,
    copyShippingAddress: copyShippingAddress,
    updateAddressFields: updateAddressFields,
    gatherShippingAddresses: gatherShippingAddresses
};
