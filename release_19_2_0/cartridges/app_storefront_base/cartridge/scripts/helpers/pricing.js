'use strict';

var HashMap = require('dw/util/HashMap');
var Template = require('dw/util/Template');
var money = require('dw/value/Money');
var collections = require('*/cartridge/scripts/util/collections');


/**
 * Return root price book for a given price book
 * @param {dw.catalog.PriceBook} priceBook - Provided price book
 * @returns {dw.catalog.PriceBook} root price book
 */
function getRootPriceBook(priceBook) {
    var rootPriceBook = priceBook;
    while (rootPriceBook.parentPriceBook) {
        rootPriceBook = rootPriceBook.parentPriceBook;
    }
    return rootPriceBook;
}

/**
 * Creates a HashMap input object for dw.util.Template.render(HashMap)
 * @param {Object} keyMap - Key-value pairs object
 * @return {dw.util.HashMap} - HashMap from key-value pairs
 */
function getHtmlContext(keyMap) {
    var context = new HashMap();
    Object.keys(keyMap).forEach(function (key) {
        context.put(key, keyMap[key]);
    });
    return context;
}

/**
 * Get a product's promotional price
 *
 * @param {dw.catalog.Product} product - Product under evaluation
 * @param {dw.util.Collection.<dw.campaign.Promotion>} promotions - Promotions that apply to this
 *     product
 * @param {dw.catalog.ProductOptionModel} currentOptionModel - The product's option model
 * @return {dw.value.Money} - Promotional price
 */
function getPromotionPrice(product, promotions, currentOptionModel) {
    var PROMOTION_CLASS_PRODUCT = require('dw/campaign/Promotion').PROMOTION_CLASS_PRODUCT;
    var price = money.NOT_AVAILABLE;
    var promotion = collections.find(promotions, function (promo) {
        return promo.promotionClass && promo.promotionClass.equals(PROMOTION_CLASS_PRODUCT);
    });

    if (promotion) {
        price = currentOptionModel
            ? promotion.getPromotionalPrice(product, currentOptionModel)
            : promotion.getPromotionalPrice(product, product.optionModel);
    }

    return price;
}

/**
 * Render Template HTML
 *
 * @param {dw.util.HashMap} context - Context object that will fill template placeholders
 * @param {string} [templatePath] - Optional template path to override default
 * @return {string} - Rendered HTML
 */
function renderHtml(context, templatePath) {
    var html;
    var path = templatePath || 'product/components/pricing/ajaxMain.isml';
    var tmpl = new Template(path);
    html = tmpl.render(context);

    return html.text;
}

module.exports = {
    getHtmlContext: getHtmlContext,
    getRootPriceBook: getRootPriceBook,
    renderHtml: renderHtml,
    getPromotionPrice: getPromotionPrice
};
