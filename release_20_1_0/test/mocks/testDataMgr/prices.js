'use strict';

import _ from 'lodash';

export const priceTypes = ['list', 'sale'];

/**
 * Loads Price Books test data
 *
 * @param {Object} priceBooks - Price book object mapped by Price Book IDs
 * @param {string} productId - Product ID
 * @param {string} currencyCode - three-letter currency code
 * @returns {Object} - JSON object with specific Price Book test data
 */
export function getPricesForProduct(priceBooks, productId, currencyCode = 'usd') {
    let prices = {};

    for (let type of priceTypes) {
        let products = priceBooks[getPriceBookName(type, currencyCode)].products;
        let price = _.findWhere(products, { productId: productId });
        prices[type] = price ? _.result(price, 'amount') : undefined;
    }
    return prices;
}

/**
 * Processes parsed JSONified file data and sends back a map of Price Books
 *
 * @param {Object} priceBooks - Parsed data from XML files
 * @returns {Object} - Map of Price Books grouped by Price Book IDs
 */
export function parsePriceBooks(priceBooks, currentPricebooks) {
    let priceBookList = currentPricebooks || {};

    priceBooks.pricebooks.pricebook.forEach(element => {
        let header = element.header[0];
        let priceBookId = header.$['pricebook-id'];
        let priceTables = element['price-tables'][0]['price-table'];
        let priceTableList = [];

        priceBookList[priceBookId] = {};
        priceBookList[priceBookId].header = {
            currency: header.currency[0],
            onlineFlag: header['online-flag'][0] === 'true'
        };

        priceTables.forEach(priceTable => {
            let proxy = {
                productId: priceTable.$['product-id'],
                amount: priceTable.amount[0]._,
                amountQty: priceTable.amount[0].$.quantity
            };

            priceTableList.push(proxy);
        });
        priceBookList[priceBookId].products = priceTableList;
    });

    return priceBookList;
}

function getPriceBookName(priceType, currencyCode = 'usd') {
    let parsedCurrencyCode = currencyCode.toLowerCase();
    return [parsedCurrencyCode, priceType, 'prices'].join('-');
}

