'use strict';

var BasketMgr = require('dw/order/BasketMgr');
var URLUtils = require('dw/web/URLUtils');
var Resource = require('dw/web/Resource');
var collections = require('*/cartridge/scripts/util/collections');

/**
 * Generates the count of the discount line item to determine if it is full
 * @param {dw.order.BonusDiscountLineItem} item - a product line item
 * @returns {number} the total number of bonus products from within one bonus discount line item
 */
function countBonusProducts(item) {
    var count = 0;

    collections.forEach(item.bonusProductLineItems, function (bonusDiscountLineItem) {
        count += bonusDiscountLineItem.quantityValue;
    });

    return count;
}

/**
 * Generates an object of URLs
 * @param {string} UUID - product line item uuid
 * @returns {number} the total number of bonus products from within one bonus discount line item
 */
function getDiscountLineItems(UUID) {
    var basket = BasketMgr.getCurrentBasket();
    var result = [];
    if (basket) {
        var bonusDiscountLineItems = basket.bonusDiscountLineItems;
        collections.forEach(bonusDiscountLineItems, function (bonusDiscountLineItem) {
            var bdliObj = {};
            if (UUID === bonusDiscountLineItem.custom.bonusProductLineItemUUID) {
                bdliObj.pliuuid = bonusDiscountLineItem.custom.bonusProductLineItemUUID;
                bdliObj.uuid = bonusDiscountLineItem.UUID;
                bdliObj.full = countBonusProducts(bonusDiscountLineItem) < bonusDiscountLineItem.maxBonusItems;
                bdliObj.maxpids = bonusDiscountLineItem.maxBonusItems;
                bdliObj.url = URLUtils.url('Cart-EditBonusProduct', 'duuid', bonusDiscountLineItem.UUID).toString();
                bdliObj.msg = bdliObj.full ? Resource.msg('button.bonus.select', 'cart', null) : Resource.msg('button.bonus.change', 'cart', null);
                result.push(bdliObj);
            }
        });
    }
    return result;
}

module.exports = function (object, UUID) {
    Object.defineProperty(object, 'discountLineItems', {
        enumerable: true,
        value: getDiscountLineItems(UUID)
    });
};
