'use strict';

var formatMoney = require('dw/util/StringUtils').formatMoney;
var Money = require('dw/value/Money');

/**
 * Returns the string representation of an amount, using specified currencyCode/countryCode
 * @param {number} value - the currency value
 * @param {string} currencyCode - the currency code
 * @return {string} formatted currency string
 */
function formatCurrency(value, currencyCode) {
    return formatMoney(new Money(value, currencyCode));
}

module.exports = {
    formatCurrency: formatCurrency
};
