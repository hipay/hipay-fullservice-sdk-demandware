'use strict';

var DefaultPrice = require('*/cartridge/models/price/default');


/**
 * @constructor
 * @classdesc Range price class
 * @param {dw.value.Money} min - Range minimum price
 * @param {dw.value.Money} max - Range maximum price
 */
function RangePrice(min, max) {
    this.type = 'range';
    this.min = new DefaultPrice(min);
    this.max = new DefaultPrice(max);
}

module.exports = RangePrice;
