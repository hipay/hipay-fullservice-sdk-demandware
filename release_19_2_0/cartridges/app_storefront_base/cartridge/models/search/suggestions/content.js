'use strict';

var URLUtils = require('dw/web/URLUtils');


/**
 * @constructor
 * @classdesc ContentSuggestions class
 *
 * @param {dw.suggest.SuggestModel} suggestions - Suggest Model
 * @param {number} maxItems - Maximum number of content items to retrieve
 */
function ContentSuggestions(suggestions, maxItems) {
    this.contents = [];

    if (!suggestions.contentSuggestions) {
        this.available = false;
        return;
    }

    var contentSuggestions = suggestions.contentSuggestions;
    var iter = contentSuggestions.suggestedContent;

    this.available = contentSuggestions.hasSuggestions();

    for (var i = 0; i < maxItems; i++) {
        var content;

        if (iter.hasNext()) {
            content = iter.next().content;
            this.contents.push({
                name: content.name,
                url: URLUtils.url('Page-Show', 'cid', content.ID)
            });
        }
    }
}

module.exports = ContentSuggestions;
