'use strict';

var BasketMgr = require('dw/order/BasketMgr');
var collections = require('*/cartridge/scripts/util/collections');

/**
 * returns the price of the bonus product line item
 * @param {dw.order.ProductLineItem} lineItem - API ProductLineItem instance of the embedded bonus product line item
 * @param {dw.catalog.Product} product - qualifying product.
 * @returns {string} result the price of the bonus product
 */
function getBonusUnitPrice(lineItem, product) {
    var currentBasket = BasketMgr.getCurrentBasket();
    if (!currentBasket) {
        return '';
    }
    var bonusDisconutLineItem = collections.find(currentBasket.getBonusDiscountLineItems(), function (dli) {
        return dli.custom.bonusProductLineItemUUID === lineItem.custom.bonusProductLineItemUUID;
    });
    if (!product || !bonusDisconutLineItem) {
        return '';
    }
    return bonusDisconutLineItem.getBonusProductPrice(product).toFormattedString();
}

module.exports = function (object, lineItem, product) {
    Object.defineProperty(object, 'bonusUnitPrice', {
        enumerable: true,
        value: getBonusUnitPrice(lineItem, product)
    });
};
