'use strict';

var formatMoney = require('dw/util/StringUtils').formatMoney;

/**
 * Convert API price to an object
 * @param {dw.value.Money} price - Price object returned from the API
 * @returns {Object} price formatted as a simple object
 */
function toPriceModel(price) {
    var value = price.available ? price.getDecimalValue().get() : null;
    var currency = price.available ? price.getCurrencyCode() : null;
    var formattedPrice = price.available ? formatMoney(price) : null;
    var decimalPrice;

    if (formattedPrice) { decimalPrice = price.getDecimalValue().toString(); }

    return {
        value: value,
        currency: currency,
        formatted: formattedPrice,
        decimalPrice: decimalPrice
    };
}

/**
 * @constructor
 * @classdesc Default price class
 * @param {dw.value.Money} salesPrice - Sales price
 * @param {dw.value.Money} listPrice - List price
 */
function DefaultPrice(salesPrice, listPrice) {
    this.sales = toPriceModel(salesPrice);
    this.list = listPrice ? toPriceModel(listPrice) : null;
}

module.exports = DefaultPrice;
