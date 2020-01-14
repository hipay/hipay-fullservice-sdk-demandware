'use strict';

var renderTemplateHelper = require('*/cartridge/scripts/renderTemplateHelper');

/**
 * get the rendered applied promotions
 * @param {Object[]} appliedPromotions - an array of objects containing the product line items
 *                                    applied promotions
 * @returns {string} the rendered html for the applied promotions
 */
function getRenderedPromotions(appliedPromotions) {
    var context;
    var result = '';
    var template = 'checkout/productCard/productCardProductRenderedPromotions';

    if (appliedPromotions) {
        context = { lineItem: { appliedPromotions: appliedPromotions } };
        result = renderTemplateHelper.getRenderedHtml(context, template);
    }

    return result;
}

module.exports = function (object) {
    Object.defineProperty(object, 'renderedPromotions', {
        enumerable: true,
        value: getRenderedPromotions(object.appliedPromotions)
    });
};
