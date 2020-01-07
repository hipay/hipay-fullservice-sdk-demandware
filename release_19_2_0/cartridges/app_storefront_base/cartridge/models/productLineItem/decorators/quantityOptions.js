'use strict';

var ProductInventoryMgr = require('dw/catalog/ProductInventoryMgr');
var preferences = require('*/cartridge/config/preferences');
var DEFAULT_MAX_ORDER_QUANTITY = preferences.maxOrderQty || 10;

/**
 * get the min and max numbers to display in the quantity drop down.
 * @param {Object} productLineItem - a line item of the basket.
 * @param {number} quantity - number of items for this product
 * @returns {Object} The minOrderQuantity and maxOrderQuantity to display in the quantity drop down.
 */
function getMinMaxQuantityOptions(productLineItem, quantity) {
    var availableToSell = productLineItem.product.availabilityModel.inventoryRecord.ATS.value;
    var perpetual = productLineItem.product.availabilityModel.inventoryRecord.perpetual;
    var max;
    if (productLineItem.productInventoryListID) {
        var inventoryList = ProductInventoryMgr.getInventoryList(productLineItem.productInventoryListID);
        var inventoryRecord = inventoryList.getRecord(productLineItem.product.ID);
        availableToSell = inventoryRecord.ATS.value;
        perpetual = inventoryRecord.perpetual;
    }

    if (perpetual) {
        max = Math.max(DEFAULT_MAX_ORDER_QUANTITY, quantity);
    } else {
        max = Math.max(Math.min(availableToSell, DEFAULT_MAX_ORDER_QUANTITY), quantity);
    }

    return {
        minOrderQuantity: productLineItem.product.minOrderQuantity.value || 1,
        maxOrderQuantity: max
    };
}

module.exports = function (object, productLineItem, quantity) {
    Object.defineProperty(object, 'quantityOptions', {
        enumerable: true,
        value: getMinMaxQuantityOptions(productLineItem, quantity)
    });
};
