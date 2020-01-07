'use strict';

/**
 * Get product schema information
 * @param {Object} product - Product Object
 *
 * @returns {Object} - Product Schema object
 */
function getProductSchema(product) {
    var schema = {
        '@context': 'http://schema.org/',
        '@type': 'Product',
        name: product.productName,
        description: product.shortDescription,
        mpn: product.id,
        sku: product.id
    };
    if (product.brand) {
        schema.brand = {
            '@type': 'Thing',
            name: product.brand
        };
    }
    if (product.images && product.images.large) {
        schema.image = [];
        product.images.large.forEach(function (image) {
            schema.image.push(image.absURL);
        });
    }
    if (product.price) {
        schema.offers = {
            url: require('dw/web/URLUtils').url('Product-Show', 'pid', product.id)
        };
        if (product.price.type === 'range') {
            schema.offers['@type'] = 'AggregateOffer';
            schema.offers.priceCurrency = product.price.currency;
            schema.offers.lowprice = product.price.min;
            schema.offers.highprice = product.price.max;
        } else {
            schema.offers['@type'] = 'Offer';
            if (product.price.sales) {
                schema.offers.priceCurrency = product.price.sales.currency;
                schema.offers.price = product.price.sales.decimalPrice;
            } else if (product.price.list) {
                schema.offers.priceCurrency = product.price.list.currency;
                schema.offers.price = product.price.list.decimalPrice;
            }
        }
        schema.offers.availability = 'http://schema.org/InStock';
        if (product.available) {
            if (product.availability && product.availability.messages[0] === require('dw/web/Resource').msg('label.preorder', 'common', null)) {
                schema.offers.availability = 'http://schema.org/PreOrder';
            }
        } else {
            schema.offers.availability = 'http://schema.org/OutOfStock';
        }
    }
    return schema;
}

/**
 * Get product listing page schema information
 * @param {List} productIds - Product Ids
 *
 * @returns {Object} - Listing Schema object
 */
function getListingPageSchema(productIds) {
    var schema = {
        '@context': 'http://schema.org/',
        '@type': 'ItemList',
        itemListElement: []
    };
    Object.keys(productIds).forEach(function (item) {
        var productID = productIds[item].productID;
        schema.itemListElement.push({
            '@type': 'ListItem',
            position: Number(item) + 1,
            url: require('dw/web/URLUtils').abs('Product-Show', 'pid', productID).toString()
        });
    });
    return schema;
}
module.exports = {
    getProductSchema: getProductSchema,
    getListingPageSchema: getListingPageSchema
};
