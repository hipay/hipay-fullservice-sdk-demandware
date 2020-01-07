'use strict';

var BasketMgr = require('dw/order/BasketMgr');
var collections = require('*/cartridge/scripts/util/collections');

/**
 * returns the price of the bonus product
 * @param {dw.catalog.Product} apiProduct - Product information returned by the script API
 * @param {string} duuid - discount line item UUID
 * @returns {string} - returns the price of the bonus product
 */
function getBonusUnitPrice(apiProduct, duuid) {
    var currentBasket = BasketMgr.getCurrentBasket();

    var bonusDisconutLineItem = collections.find(currentBasket.getBonusDiscountLineItems(), function (dli) {
        return dli.UUID === duuid;
    });

    if (!apiProduct || !bonusDisconutLineItem) {
        return '';
    }

    return bonusDisconutLineItem.getBonusProductPrice(apiProduct).toFormattedString();
}

module.exports = function (object, apiProduct, duuid) {
    Object.defineProperty(object, 'bonusUnitPrice', {
        enumerable: true,
        value: getBonusUnitPrice(apiProduct, duuid)
    });
};
