'use strict';

var BaseAttributeValue = require('*/cartridge/models/search/attributeRefinementValue/base');
var Resource = require('dw/web/Resource');


/**
 * @constructor
 * @classdesc Boolean attribute refinement value model
 *
 * @param {dw.catalog.ProductSearchModel} productSearch - ProductSearchModel instance
 * @param {dw.catalog.ProductSearchRefinementDefinition} refinementDefinition - Refinement
 *     definition
 * @param {dw.catalog.ProductSearchRefinementValue} refinementValue - Raw DW refinement value
 */
function BooleanAttributeValue(productSearch, refinementDefinition, refinementValue) {
    this.productSearch = productSearch;
    this.refinementDefinition = refinementDefinition;
    this.refinementValue = refinementValue;

    this.initialize();
}

BooleanAttributeValue.prototype = Object.create(BaseAttributeValue.prototype);

BooleanAttributeValue.prototype.initialize = function () {
    BaseAttributeValue.prototype.initialize.call(this);

    this.type = 'boolean';
    this.displayValue = this.getDisplayValue(
        this.refinementDefinition.attributeID,
        this.refinementValue.displayValue
    );
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

BooleanAttributeValue.prototype.getDisplayValue = function (attributeID, displayValue) {
    return Resource.msg(
        ['label.refinement', attributeID, displayValue].join('.'),
        'search',
        displayValue
    );
};

/**
 * @constructor
 * @classdesc Boolean attribute refinement value model
 *
 * @param {dw.catalog.ProductSearchModel} productSearch - ProductSearchModel instance
 * @param {dw.catalog.ProductSearchRefinementDefinition} refinementDefinition - Refinement
 *     definition
 * @param {dw.catalog.ProductSearchRefinementValue} refinementValue - Raw DW refinement value
 */
function BooleanRefinementValueWrapper(productSearch, refinementDefinition, refinementValue) {
    var value = new BooleanAttributeValue(
        productSearch,
        refinementDefinition,
        refinementValue
    );
    var items = [
        'id',
        'type',
        'displayValue',
        'selected',
        'selectable',
        'title',
        'url'
    ];
    items.forEach(function (item) {
        this[item] = value[item];
    }, this);
}

module.exports = BooleanRefinementValueWrapper;
