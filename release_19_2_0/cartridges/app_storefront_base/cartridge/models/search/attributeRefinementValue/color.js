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
function ColorAttributeValue(productSearch, refinementDefinition, refinementValue) {
    this.productSearch = productSearch;
    this.refinementDefinition = refinementDefinition;
    this.refinementValue = refinementValue;

    this.initialize();
}

ColorAttributeValue.prototype = Object.create(BaseAttributeValue.prototype);

ColorAttributeValue.prototype.initialize = function () {
    BaseAttributeValue.prototype.initialize.call(this);

    this.type = 'color';
    this.displayValue = this.getDisplayValue(this.refinementValue);
    this.swatchId = 'swatch-circle-' + this.presentationId;
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
 * @classdesc Color attribute refinement value model
 *
 * @param {dw.catalog.ProductSearchModel} productSearch - ProductSearchModel instance
 * @param {dw.catalog.ProductSearchRefinementDefinition} refinementDefinition - Refinement
 *     definition
 * @param {dw.catalog.ProductSearchRefinementValue} refinementValue - Raw DW refinement value
 */
function ColorRefinementValueWrapper(productSearch, refinementDefinition, refinementValue) {
    var value = new ColorAttributeValue(
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
        'swatchId',
        'title',
        'url'
    ];
    items.forEach(function (item) {
        this[item] = value[item];
    }, this);
}

module.exports = ColorRefinementValueWrapper;
