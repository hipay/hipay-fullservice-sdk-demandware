'use strict';

var productDecorators = require('*/cartridge/models/product/decorators/index');
var productLineItemDecorators = require('*/cartridge/models/productLineItem/decorators/index');

/**
 * Decorate product with product line item information
 * @param {Object} product - Product Model to be decorated
 * @param {dw.catalog.Product} apiProduct - Product information returned by the script API
 * @param {Object} options - Options passed in from the factory
 * @property {dw.catalog.ProductVarationModel} options.variationModel - Variation model returned by the API
 * @property {Object} options.lineItemOptions - Options provided on the query string
 * @property {dw.catalog.ProductOptionModel} options.currentOptionModel - Options model returned by the API
 * @property {dw.util.Collection} options.promotions - Active promotions for a given product
 * @property {number} options.quantity - Current selected quantity
 * @property {Object} options.variables - Variables passed in on the query string
 * @param {Object} factory - Reference to product factory
 *
 * @returns {Object} - Decorated product model
 */
module.exports = function productLineItem(product, apiProduct, options, factory) {
    productDecorators.base(product, apiProduct, options.productType);
    productDecorators.price(product, apiProduct, options.promotions, false, options.currentOptionModel);
    productDecorators.images(product, apiProduct, { types: ['small'], quantity: 'single' });

    productDecorators.availability(product, options.quantity, apiProduct.minOrderQuantity.value, apiProduct.availabilityModel);

    productLineItemDecorators.quantity(product, options.quantity);
    productLineItemDecorators.gift(product, options.lineItem);
    productLineItemDecorators.appliedPromotions(product, options.lineItem);
    productLineItemDecorators.renderedPromotions(product); // must get applied promotions first
    productLineItemDecorators.uuid(product, options.lineItem);
    productLineItemDecorators.orderable(product, apiProduct, options.quantity);
    productLineItemDecorators.shipment(product, options.lineItem);
    productLineItemDecorators.bonusProductLineItem(product, options.lineItem);
    productLineItemDecorators.priceTotal(product, options.lineItem);
    productLineItemDecorators.quantityOptions(product, options.lineItem, options.quantity);

    productLineItemDecorators.bundledProductLineItems(product, options.lineItem, factory);

    return product;
};
