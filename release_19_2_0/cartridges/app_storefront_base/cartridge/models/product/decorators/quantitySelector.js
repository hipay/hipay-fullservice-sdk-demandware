'use strict';

var URLUtils = require('dw/web/URLUtils');
var urlHelper = require('*/cartridge/scripts/helpers/urlHelpers');

/**
 * Compile quantity meta for pull-down menu selection
 *
 * @param {number} minOrderQty - Minimum order quantity
 * @param {number} maxOrderQty - Maximum order quantity
 * @param {number} stepQuantity - Quantity increment from one value to the next
 * @param {string} selectedQty - Quanity selected
 * @param {string} pid - Product ID
 * @param {Object} attributes - Variation attribute query params
 * @param {ProductOptions[]} options - Product options query params
 * @return {Array} - Quantity options for PDP pull-down menu
 */
function getQuantities(minOrderQty, maxOrderQty, stepQuantity, selectedQty, pid, attributes, options) {
    var listSize = maxOrderQty;
    var quantities = [];
    var compareQty = parseInt(selectedQty, 10) || minOrderQty;
    var endpoint = 'Product-Variation';
    var baseUrl = URLUtils.url(endpoint, 'pid', pid).relative().toString();
    var params = {
        options: options || [],
        variables: attributes || {}
    };
    var value;
    var valueString;
    var url;
    for (var i = 1; i < listSize + 1; i++) {
        value = minOrderQty * i * stepQuantity;
        valueString = value.toString();
        params.quantity = valueString;
        url = urlHelper.appendQueryParams(baseUrl, params);
        quantities.push({
            value: valueString,
            selected: value === compareQty,
            url: url
        });
    }
    return quantities;
}

module.exports = function (object, stepQuantity, attributes, options) {
    Object.defineProperty(object, 'quantities', {
        enumerable: true,
        value: getQuantities(object.minOrderQuantity, object.maxOrderQuantity, stepQuantity, object.selectedQuantity, object.id, attributes, options)
    });
};
