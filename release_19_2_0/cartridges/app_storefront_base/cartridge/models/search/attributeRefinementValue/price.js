'use strict';

var BaseAttributeValue = require('*/cartridge/models/search/attributeRefinementValue/base');


/**
 * @constructor
 * @classdesc Color attribute refinement value model
 *
 * @param {dw.catalog.ProductSearchModel} productSearch - ProductSearchModel instance
 * @param {dw.catalog.ProductSearchRefinementDefinition} refinementDefinition - Refinement
 *     definition
 * @param {dw.catalog.ProductSearchRefinementValue} refinementValue - Raw DW refinement value
 */
function PriceAttributeValue(productSearch, refinementDefinition, refinementValue) {
    this.productSearch = productSearch;
    this.refinementDefinition = refinementDefinition;
    this.refinementValue = refinementValue;

    this.initialize();
}

PriceAttributeValue.prototype = Object.create(BaseAttributeValue.prototype);

PriceAttributeValue.prototype.initialize = function () {
    BaseAttributeValue.prototype.initialize.call(this);

    this.type = 'price';
    this.valueFrom = this.refinementValue.valueFrom;
    this.valueTo = this.refinementValue.valueTo;
    this.displayValue = this.refinementValue.displayValue;
    this.selected = this.isSelected(this.productSearch, this.valueFrom, this.valueTo);
    this.url = this.getUrl(
        this.productSearch,
        this.actionEndpoint,
        this.selected,
        this.valueFrom,
        this.valueTo
    );
    this.title = this.getTitle(
        this.selected,
        this.selectable,
        this.refinementDefinition.displayName,
        this.displayValue
    );
};

/**
 * Forms URL for this price refinement value
 *
 * @param {dw.catalog.ProductSearchModel} productSearch - ProductSearchModel instance
 * @param {string} actionEndpoint - Resource URL for Search
 * @param {boolean} selected - Indicates whether this value has been selected
 * @param {number} valueFrom - Start of price refinement range
 * @param {number} valueTo - End of price refinement range
 * @return {string} - URL to select/deselect a price bucket refinement value
 */
PriceAttributeValue.prototype.getUrl = function (
    productSearch,
    actionEndpoint,
    selected,
    valueFrom,
    valueTo
) {
    return selected
        ? productSearch.urlRelaxPrice(actionEndpoint).relative().toString()
        : productSearch.urlRefinePrice(actionEndpoint, valueFrom, valueTo).relative().toString();
};

/**
 * Determines whether this price refinement value has been selected
 *
 * @param {dw.catalog.ProductSearchModel} productSearch - ProductSearchModel instance
 * @param {number} valueFrom - Start of price refinement range
 * @param {number} valueTo - End of price refinement range
 * @return {boolean} - Indicates whether this price refinement value is selected
 */
PriceAttributeValue.prototype.isSelected = function (productSearch, valueFrom, valueTo) {
    return productSearch.isRefinedByPriceRange(valueFrom, valueTo);
};

/**
 * @constructor
 * @classdesc Price refinement value class
 *
 * @param {dw.catalog.ProductSearchModel} productSearch - ProductSearchModel instance
 * @param {dw.catalog.ProductSearchRefinementDefinition} refinementDefinition - Refinement
 *     definition
 * @param {dw.catalog.ProductSearchRefinementValue} refinementValue - Raw DW refinement value
 */
function PriceRefinementValueWrapper(productSearch, refinementDefinition, refinementValue) {
    var value = new PriceAttributeValue(
        productSearch,
        refinementDefinition,
        refinementValue
    );
    var items = [
        'displayValue',
        'selected',
        'title',
        'url'
    ];
    items.forEach(function (item) {
        this[item] = value[item];
    }, this);
}

module.exports = PriceRefinementValueWrapper;
