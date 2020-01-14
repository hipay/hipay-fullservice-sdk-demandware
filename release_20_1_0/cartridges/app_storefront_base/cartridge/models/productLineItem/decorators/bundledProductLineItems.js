'use strict';

var collections = require('*/cartridge/scripts/util/collections');

/**
 * creates an array of bundled line items
 * @param {dw.util.Collection} bundledProductLineItems - Collection of products in the bundle
 * @param {Object} productFactory - Factory utility that returns a ProductModel instance
 * @returns {Array} an array of bundled line items
 */
function getBundledProductLineItems(bundledProductLineItems, productFactory) {
    var bundledLineItems = collections.map(
        bundledProductLineItems,
        function (bundledProductLineItem) {
            return productFactory.get({
                pid: bundledProductLineItem.product.ID,
                pview: 'productLineItem',
                lineItem: bundledProductLineItem,
                quantity: bundledProductLineItem.quantity.value,
                variables: null
            });
        }
    );
    return bundledLineItems;
}

module.exports = function (object, lineItem, factory) {
    Object.defineProperty(object, 'bundledProductLineItems', {
        enumerable: true,
        value: getBundledProductLineItems(lineItem.bundledProductLineItems, factory)
    });
};
