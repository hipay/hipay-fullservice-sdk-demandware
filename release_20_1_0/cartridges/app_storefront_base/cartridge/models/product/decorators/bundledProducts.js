'use strict';

var collection = require('*/cartridge/scripts/util/collections');

/**
 * Convert bundled products to models
 * @param {dw.catalog.Product} apiProduct - Product returned by the API
 * @param {number} quantity - selected quantity
 * @param {Object} factory - Product Factory object
 *
 * @returns {Array<Object>} - returns an array of bundle product models
 */
function getBundledProducts(apiProduct, quantity, factory) {
    return collection.map(apiProduct.bundledProducts, function (bundledProduct) {
        return factory.get({
            pid: bundledProduct.ID,
            quantity: quantity
        });
    });
}

module.exports = function (object, apiProduct, quantity, factory) {
    Object.defineProperty(object, 'bundledProducts', {
        enumerable: true,
        value: getBundledProducts(apiProduct, quantity, factory)
    });
};
