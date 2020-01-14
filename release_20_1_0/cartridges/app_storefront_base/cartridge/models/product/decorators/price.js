'use strict';

var priceFactory = require('*/cartridge/scripts/factories/price');

module.exports = function (object, product, promotions, useSimplePrice, currentOptions) {
    Object.defineProperty(object, 'price', {
        enumerable: true,
        value: priceFactory.getPrice(product, null, useSimplePrice, promotions, currentOptions)
    });
};
