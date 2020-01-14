'use strict';

var productHelper = require('*/cartridge/scripts/helpers/productHelpers');
var urlHelper = require('*/cartridge/scripts/helpers/urlHelpers');
var URLUtils = require('dw/web/URLUtils');

/**
 * creates a url of the product's selected attributes
 * @param {dw.catalog.ProductVariationModel} variationModel - The product's variation model
 * @param {dw.catalog.ProductOptionModel} optionModel - The product's option model
 * @param {string} endPoint - the endpoint to use when generating urls for product attributes
 * @param {string} id - the current product's id
 * @param {number} quantity - quantity to purchase
 * @returns {string} a url of the product's selected attributes
 */
function getUrl(variationModel, optionModel, endPoint, id, quantity) {
    var params = ['quantity=' + quantity];
    var action = endPoint || 'Product-Show';
    var optionsQueryParams = productHelper.getSelectedOptionsUrl(optionModel).split('?')[1];
    var url = variationModel ? variationModel.url(action) : URLUtils.url(action, 'pid', id);

    if (optionsQueryParams) {
        optionsQueryParams.split('&').forEach(function (keyValue) {
            params.push(keyValue);
        });
    }

    return urlHelper.appendQueryParams(url.relative().toString(), params);
}

module.exports = function (object, variationModel, optionModel, endPoint, id, quantity) {
    Object.defineProperty(object, 'selectedProductUrl', {
        enumerable: true,
        value: getUrl(variationModel, optionModel, endPoint, id, quantity)
    });
};
