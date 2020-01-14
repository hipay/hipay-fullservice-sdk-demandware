'use strict';

var Resource = require('dw/web/Resource');

var ACTION_ENDPOINT = 'Search-ShowAjax';


/**
 * @constructor
 * @private
 * @classdesc Abstract attribute refinement value model
 *
 * @param {dw.catalog.ProductSearchModel} productSearch - ProductSearchModel instance
 * @param {dw.catalog.ProductSearchRefinementDefinition} refinementDefinition - Refinement
 *     definition
 * @param {dw.catalog.ProductSearchRefinementValue} refinementValue - Raw DW refinement value
 */
function BaseAttributeValue(productSearch, refinementDefinition, refinementValue) {
    this.productSearch = productSearch;
    this.refinementDefinition = refinementDefinition;
    this.refinementValue = refinementValue;

    this.initialize();
}

BaseAttributeValue.prototype = {
    initialize: function () {
        this.id = this.refinementValue.ID;
        this.presentationId = this.refinementValue.presentationID;
        this.value = this.refinementValue.value;
        this.hitCount = this.refinementValue.hitCount;
        this.selectable = this.refinementValue.hitCount > 0;
        this.actionEndpoint = ACTION_ENDPOINT;
    },
    getDisplayValue: function (refinementValue) {
        return refinementValue.displayValue;
    },
    getUrl: function (productSearch, actionEndpoint, id, value, selected, selectable) {
        var url = '';

        if (selected) {
            url = productSearch.urlRelaxAttributeValue(actionEndpoint, id, value)
                .relative().toString();
        } else if (!selectable) {
            url = '#';
        } else {
            url = productSearch.urlRefineAttributeValue(actionEndpoint, id, value)
                .relative().toString();
        }

        return url;
    },
    getTitle: function (selected, selectable, refinementName, displayValue) {
        var key = '';

        if (selected) {
            key = 'label.refinement.selected';
        } else if (!selectable) {
            key = 'label.refinement.unselectable';
        } else {
            key = 'label.refinement';
        }

        return Resource.msgf(
            key,
            'search',
            null,
            refinementName,
            displayValue
        );
    },
    isSelected: function (productSearch, refinementAttributeID, value) {
        return productSearch.isRefinedByAttributeValue(refinementAttributeID, value);
    }
};

module.exports = BaseAttributeValue;
module.exports.actionEndpoint = ACTION_ENDPOINT;
