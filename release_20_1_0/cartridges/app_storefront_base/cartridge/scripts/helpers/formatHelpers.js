'use strict';

var StringUtils = require('dw/util/StringUtils');

/**
 * formats a given number
 * @param {number} value - number that needs formatting
 * @returns {number} formatted number
 */
function formatNumber(value) {
    var result = StringUtils.formatNumber(value, '#,##0', 'en_US');
    return result;
}

/**
 * formats a given price
 * @param {number} value - price that needs formatting
 * @returns {number} formatted price
 */
function formatPrice(value) {
    var result = StringUtils.formatNumber(value, '#,##0.00', 'en_US');
    return result;
}

module.exports = {
    formatNumber: formatNumber,
    formatPrice: formatPrice
};
