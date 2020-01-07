'use strict';

/**
 *
 * @param {dw.catalog.Product} apiProduct - Product returned by the API
 *
 *
 * @returns {int} the number of the products in the Set
 */
function getSetProductsLength(apiProduct) {
    return apiProduct.productSetProducts.length;
}

module.exports = function (object, apiProduct) {
    Object.defineProperty(object, 'numberOfProductsInSet', {
        enumerable: true,
        value: getSetProductsLength(apiProduct)
    });
};
