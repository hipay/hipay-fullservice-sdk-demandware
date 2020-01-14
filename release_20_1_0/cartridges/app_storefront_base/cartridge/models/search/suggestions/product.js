'use strict';

var URLUtils = require('dw/web/URLUtils');
var ACTION_ENDPOINT = 'Product-Show';
var IMAGE_SIZE = 'medium';


/**
 * Get Image URL
 *
 * @param {dw.catalog.Product} product - Suggested product
 * @return {string} - Image URL
 */
function getImageUrl(product) {
    var imageProduct = product;
    if (product.master) {
        imageProduct = product.variationModel.defaultVariant;
    }
    return imageProduct.getImage(IMAGE_SIZE).URL.toString();
}

/**
 * Compile a list of relevant suggested products
 *
 * @param {dw.util.Iterator.<dw.suggest.SuggestedProduct>} suggestedProducts - Iterator to retrieve
 *                                                                             SuggestedProducts
*  @param {number} maxItems - Maximum number of products to retrieve
 * @return {Object[]} - Array of suggested products
 */
function getProducts(suggestedProducts, maxItems) {
    var product = null;
    var products = [];

    for (var i = 0; i < maxItems; i++) {
        if (suggestedProducts.hasNext()) {
            product = suggestedProducts.next().productSearchHit.product;
            products.push({
                name: product.name,
                imageUrl: getImageUrl(product),
                url: URLUtils.url(ACTION_ENDPOINT, 'pid', product.ID)
            });
        }
    }

    return products;
}

/**
 * @typedef SuggestedPhrase
 * @type Object
 * @property {boolean} exactMatch - Whether suggested phrase is an exact match
 * @property {string} value - Suggested search phrase
 */

/**
 * Compile a list of relevant suggested phrases
 *
 * @param {dw.util.Iterator.<dw.suggest.SuggestedPhrase>} suggestedPhrases - Iterator to retrieve
 *                                                                           SuggestedPhrases
 * @param {number} maxItems - Maximum number of phrases to retrieve
 * @return {SuggestedPhrase[]} - Array of suggested phrases
 */
function getPhrases(suggestedPhrases, maxItems) {
    var phrase = null;
    var phrases = [];

    for (var i = 0; i < maxItems; i++) {
        if (suggestedPhrases.hasNext()) {
            phrase = suggestedPhrases.next();
            phrases.push({
                exactMatch: phrase.exactMatch,
                value: phrase.phrase
            });
        }
    }

    return phrases;
}

/**
 * @constructor
 * @classdesc ProductSuggestions class
 *
 * @param {dw.suggest.SuggestModel} suggestions - Suggest Model
 * @param {number} maxItems - Maximum number of items to retrieve
 */
function ProductSuggestions(suggestions, maxItems) {
    var productSuggestions = suggestions.productSuggestions;

    if (!productSuggestions) {
        this.available = false;
        this.phrases = [];
        this.products = [];
        return;
    }

    var searchPhrasesSuggestions = productSuggestions.searchPhraseSuggestions;

    this.available = productSuggestions.hasSuggestions();
    this.phrases = getPhrases(searchPhrasesSuggestions.suggestedPhrases, maxItems);
    this.products = getProducts(productSuggestions.suggestedProducts, maxItems);
}

module.exports = ProductSuggestions;
