'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var mockCollections = require('../../../../mocks/util/collections');

describe('ProductSortOptions model', function () {
    var sortRuleUrlWithParams = 'some url with params';
    var ProductSortOptions = proxyquire('../../../../../cartridges/app_storefront_base/cartridge/models/search/productSortOptions', {
        '*/cartridge/scripts/util/collections': {
            map: mockCollections.map
        },
        '*/cartridge/scripts/helpers/urlHelpers': {
            appendQueryParams: function () {
                return {
                    toString: function () {
                        return sortRuleUrlWithParams;
                    }
                };
            }
        }
    });

    var sortRuleUrl = 'some url';
    var productSearch = {
        category: {
            defaultSortingRule: {
                ID: 'defaultRule1'
            }
        },
        urlSortingRule: function () {
            return {
                toString: function () { return sortRuleUrl; }
            };
        }
    };
    var sortingRuleId = 'provided sort rule ID';
    var sortingOption1 = {
        displayName: 'Sort Option 1',
        ID: 'abc',
        sortingRule: 'rule1'
    };
    var sortingOption2 = {
        displayName: 'Sort Option 2',
        ID: 'cde',
        sortingRule: 'rule2'
    };
    var sortingOptions = [sortingOption1, sortingOption2];
    var rootCategory = {
        defaultSortingRule: {
            ID: 'defaultRule2'
        }
    };
    var pagingModel = { end: 5 };

    it('should set a list of sorting rule options', function () {
        var productSortOptions = new ProductSortOptions(productSearch, null, sortingOptions, null, pagingModel);
        assert.deepEqual(productSortOptions.options, [{
            displayName: sortingOption1.displayName,
            id: sortingOption1.ID,
            url: sortRuleUrlWithParams
        }, {
            displayName: sortingOption2.displayName,
            id: sortingOption2.ID,
            url: sortRuleUrlWithParams
        }]);
    });

    it('should set rule ID to provided sort rule ID', function () {
        var productSortOptions = new ProductSortOptions(productSearch, sortingRuleId, sortingOptions, null, pagingModel);
        assert.isTrue(productSortOptions.ruleId === sortingRuleId);
    });

    it('should set rule ID to category\'s default sort rule ID when no rule provided', function () {
        var productSearchWithNoCategory = {
            category: null,
            urlSortingRule: productSearch.urlSortingRule
        };
        var productSortOptions = new ProductSortOptions(productSearchWithNoCategory, null, sortingOptions, rootCategory, pagingModel);
        assert.isTrue(productSortOptions.ruleId === rootCategory.defaultSortingRule.ID);
    });

    it('should set rule ID to product search\'s category\'s default sort rule ID when no rule provided', function () {
        var productSortOptions = new ProductSortOptions(productSearch, null, sortingOptions, null, pagingModel);
        assert.isTrue(productSortOptions.ruleId === productSearch.category.defaultSortingRule.ID);
    });
});
