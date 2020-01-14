'use strict';

var URLUtils = require('dw/web/URLUtils');
var endpoint = 'Search-Show';

/**
 * @constructor
 * @classdesc CategorySuggestions class
 *
 * @param {dw.suggest.SuggestModel} suggestions - Suggest Model
 * @param {number} maxItems - Maximum number of categories to retrieve
 */
function CategorySuggestions(suggestions, maxItems) {
    this.categories = [];

    if (!suggestions.categorySuggestions) {
        this.available = false;
        return;
    }

    var categorySuggestions = suggestions.categorySuggestions;
    var iter = categorySuggestions.suggestedCategories;

    this.available = categorySuggestions.hasSuggestions();

    for (var i = 0; i < maxItems; i++) {
        var category = null;

        if (iter.hasNext()) {
            category = iter.next().category;
            this.categories.push({
                name: category.displayName,
                imageUrl: category.image ? category.image.url : '',
                url: URLUtils.url(endpoint, 'cgid', category.ID),
                parentID: category.parent.ID,
                parentName: category.parent.displayName
            });
        }
    }
}

module.exports = CategorySuggestions;
