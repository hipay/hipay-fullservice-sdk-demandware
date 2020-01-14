'use strict';

var DefaultPrice = require('*/cartridge/models/price/default');
var collections = require('*/cartridge/scripts/util/collections');

/**
 * @constructor
 * @classdesc Tiered price class
 * @param {dw.catalog.ProductPriceTable} priceTable - Product price table
 * @param {boolean} useSimplePrice - Flag as to whether this price is for a product tile
 */
function TieredPrice(priceTable, useSimplePrice) {
    var startingFromPrice = null;

    this.type = 'tiered';
    this.useSimplePrice = useSimplePrice || false;

    this.tiers = collections.map(priceTable.getQuantities(), function (quantity) {
        var price = new DefaultPrice(priceTable.getPrice(quantity));

        if (!startingFromPrice) {
            startingFromPrice = price;
        }

        return {
            quantity: quantity.getValue(),
            price: price
        };
    }, this);

    this.startingFromPrice = startingFromPrice;
}

module.exports = TieredPrice;
