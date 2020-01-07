'use strict';

var collections = require('*/cartridge/scripts/util/collections');
var urlHelper = require('*/cartridge/scripts/helpers/urlHelpers');

var ACTION_ENDPOINT = 'Search-UpdateGrid';


/**
 * Retrieves sorting options
 *
 * @param {dw.catalog.ProductSearchModel} productSearch - Product search instance
 * @param {dw.util.List.<dw.catalog.SortingOption>} sortingOptions - List of sorting rule options
 * @param {dw.web.PagingModel} pagingModel - The paging model for the current search context
 * @return {SortingOption} - Sorting option
 */
function getSortingOptions(productSearch, sortingOptions, pagingModel) {
    return collections.map(sortingOptions, function (option) {
        var baseUrl = productSearch.urlSortingRule(ACTION_ENDPOINT, option.sortingRule);
        var pagingParams = {
            start: '0',
            sz: pagingModel.end + 1
        };
        return {
            displayName: option.displayName,
            id: option.ID,
            url: urlHelper.appendQueryParams(baseUrl.toString(), pagingParams).toString()
        };
    });
}

/**
 * Retrieves refined or default category sort ID
 *
 * @param {dw.catalog.ProductSearchModel} productSearch - Product search instance
 * @param {dw.catalog.Category} rootCategory - Catalog's root category
 * @return {string} - Sort rule ID or null if no default sorting rule specified
 */
function getSortRuleDefault(productSearch, rootCategory) {
    var category = productSearch.category ? productSearch.category : rootCategory;
    return category.defaultSortingRule ? category.defaultSortingRule.ID : null;
}

/**
 * @constructor
 * @classdesc Model that encapsulates product sort options
 *
 * @param {dw.catalog.ProductSearchModel} productSearch - Product search instance
 * @param {string|null} sortingRuleId - HTTP Param srule value
 * @param {dw.util.List.<dw.catalog.SortingOption>} sortingOptions - Sorting rule options
 * @param {dw.catalog.Category} rootCategory - Catalog's root category
 * @param {dw.web.PagingModel} pagingModel - The paging model for the current search context
 */
function ProductSortOptions(
    productSearch,
    sortingRuleId,
    sortingOptions,
    rootCategory,
    pagingModel
) {
    this.options = getSortingOptions(productSearch, sortingOptions, pagingModel);
    this.ruleId = sortingRuleId || getSortRuleDefault(productSearch, rootCategory);
}

module.exports = ProductSortOptions;
