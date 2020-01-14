'use strict';

var BaseAttributeValue = require('*/cartridge/models/search/attributeRefinementValue/base');


/**
 * @constructor
 * @classdesc Size attribute refinement value model
 *
 * @param {dw.catalog.ProductSearchModel} productSearch - ProductSearchModel instance
 * @param {dw.catalog.ProductSearchRefinementDefinition} refinementDefinition - Refinement
 *     definition
 * @param {dw.catalog.ProductSearchRefinementValue} refinementValue - Raw DW refinement value
 */
function SizeAttributeValue(productSearch, refinementDefinition, refinementValue) {
    this.productSearch = productSearch;
    this.refinementDefinition = refinementDefinition;
    this.refinementValue = refinementValue;

    this.initialize();
}

SizeAttributeValue.prototype = Object.create(BaseAttributeValue.prototype);

SizeAttributeValue.prototype.initialize = function () {
    BaseAttributeValue.prototype.initialize.call(this);

    this.type = 'size';
    this.displayValue = this.getDisplayValue(this.refinementValue);
    this.selected = this.isSelected(
        this.productSearch,
        this.refinementDefinition.attributeID,
        this.refinementValue.value
    );
    this.url = this.getUrl(
        this.productSearch,
        this.actionEndpoint,
        this.id,
        this.value,
        this.selected,
        this.selectable
    );
    this.title = this.getTitle(
        this.selected,
        this.selectable,
        this.refinementDefinition.displayName,
        this.displayValue
    );
};

/**
 * @constructor
 * @classdesc Size attribute refinement value model
 *
 * @param {dw.catalog.ProductSearchModel} productSearch - ProductSearchModel instance
 * @param {dw.catalog.ProductSearchRefinementDefinition} refinementDefinition - Refinement
 *     definition
 * @param {dw.catalog.ProductSearchRefinementValue} refinementValue - Raw DW refinement value
 */
function SizeRefinementValueWrapper(productSearch, refinementDefinition, refinementValue) {
    var value = new SizeAttributeValue(
        productSearch,
        refinementDefinition,
        refinementValue
    );
    var items = [
        'id',
        'type',
        'displayValue',
        'presentationId',
        'selected',
        'selectable',
        'title',
        'url'
    ];
    items.forEach(function (item) {
        this[item] = value[item];
    }, this);
}

module.exports = SizeRefinementValueWrapper;
