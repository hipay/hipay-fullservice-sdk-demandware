'use strict';

var collection = require('*/cartridge/scripts/util/collections');

/**
 *
 * @param {dw.catalog.Product} apiProduct - Product returned by the API
 * @param {Object} factory - Product Factory object
 *
 * @returns {Array<Object>} - Array of sub-product models
 */
function getIndividualProducts(apiProduct, factory) {
    return collection.map(apiProduct.bundledProducts, function (product) {
        return factory.get({ pid: product.ID });
    });
}

module.exports = function (object, apiProduct, factory) {
    Object.defineProperty(object, 'individualProducts', {
        enumerable: true,
        value: getIndividualProducts(apiProduct, factory)
    });
};
