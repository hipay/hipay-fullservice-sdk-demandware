'use strict';

var PagingModel = require('dw/web/PagingModel');
var collections = require('*/cartridge/scripts/util/collections');
var URLUtils = require('dw/web/URLUtils');
var preferences = require('*/cartridge/config/preferences');
var ACTION_ENDPOINT_GRID = 'Search-Content';
var ACTION_ENDPOINT_CONTENT = 'Page-Show';
var DEFAULT_PAGE_SIZE = preferences.defaultPageSize ? preferences.defaultPageSize : 12;

/**
 * Configures and returns a PagingModel instance
 *
 * @param {dw.util.Iterator} contentHits - Iterator for content search results
 * @param {number} count - Number of contents in search results
 * @param {number} pageSize - Number of contents to display
 * @param {number} startIndex - Beginning index value
 * @return {dw.web.PagingModel} - PagingModel instance
 */
function getPagingModel(contentHits, count, pageSize, startIndex) {
    var pagingModel = new PagingModel(contentHits, count);
    pagingModel.setStart(startIndex || 0);
    pagingModel.setPageSize(pageSize);
    return pagingModel;
}

/**
 * Transforms a page of content into an array of JSON objects
 * @param {{dw.util.List}} pageElements - PagingModel page of content
 * @return {Array} - page of content JSON objects
 */
function getContentSearchPageJSON(pageElements) {
    return collections.map(pageElements, function (contentAsset) {
        return {
            name: contentAsset.name,
            url: URLUtils.url(ACTION_ENDPOINT_CONTENT, 'cid', contentAsset.ID),
            description: contentAsset.description
        };
    });
}

/**
 * @constructor
 * @classdesc ContentSearch class
 * @param {dw.util.Iterator<dw.content.Content>} contentSearchResult - content iterator
 * @param {number} count - number of contents in the results
 * @param {string} queryPhrase - request queryPhrase
 * @param {number} startingPage - The index for the start of the content page
 * @param {number | null} pageSize - The index for the start of the content page
 *
 */
function ContentSearch(contentSearchResult, count, queryPhrase, startingPage, pageSize) {
    var ps = pageSize == null ? DEFAULT_PAGE_SIZE : pageSize;
    var pagingModel = getPagingModel(contentSearchResult, count, ps, startingPage);
    var contents = getContentSearchPageJSON(pagingModel.pageElements.asList());

    var moreContentUrl = pagingModel.maxPage > pagingModel.currentPage
        ? URLUtils.url(ACTION_ENDPOINT_GRID, 'q', queryPhrase, 'startingPage', pagingModel.end + 1)
        : null;
    this.queryPhrase = queryPhrase;
    this.contents = contents;
    this.contentCount = count;
    this.moreContentUrl = moreContentUrl;
    this.hasMessage = startingPage === 0;
}

module.exports = ContentSearch;
