'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var sinon = require('sinon');


describe('Category Suggestions model', function () {
    var nextCategoryStub = sinon.stub();
    var urlStub = sinon.stub();
    var CategorySuggestions = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/search/suggestions/category.js', {
        'dw/web/URLUtils': {
            url: urlStub
        }
    });
    var category1 = {
        category: {
            ID: 1,
            displayName: 'Category 1',
            image: {
                url: 'image url 1'
            },
            parent: {
                ID: 4,
                displayName: 'Category 1 Parent'
            }
        }
    };
    var category2 = {
        category: {
            ID: 2,
            displayName: 'Category 2',
            image: {
                url: 'image url 2'
            },
            parent: {
                ID: 5,
                displayName: 'Category 2 Parent'
            }
        }
    };
    var category3 = {
        category: {
            ID: 3,
            displayName: 'Category 3',
            image: {
                url: 'image url 3'
            },
            parent: {
                ID: 6,
                displayName: 'Category 3 Parent'
            }
        }
    };

    nextCategoryStub.onCall(0).returns(category1);
    nextCategoryStub.onCall(1).returns(category2);
    nextCategoryStub.onCall(2).returns(category3);

    urlStub.onCall(0).returns('url1');
    urlStub.onCall(1).returns('url2');
    urlStub.onCall(2).returns('url3');

    it('should produce a CategorySuggestions instance', function () {
        var suggestions = {
            categorySuggestions: {
                suggestedCategories: {
                    next: nextCategoryStub,
                    hasNext: function () { return true; }
                },
                hasSuggestions: function () { return true; }
            }
        };

        var categorySuggestions = new CategorySuggestions(suggestions, 3);

        assert.deepEqual(categorySuggestions, {
            available: true,
            categories: [{
                imageUrl: 'image url 1',
                name: 'Category 1',
                url: 'url1',
                parentID: 4,
                parentName: 'Category 1 Parent'
            }, {
                imageUrl: 'image url 2',
                name: 'Category 2',
                url: 'url2',
                parentID: 5,
                parentName: 'Category 2 Parent'
            }, {
                imageUrl: 'image url 3',
                name: 'Category 3',
                url: 'url3',
                parentID: 6,
                parentName: 'Category 3 Parent'
            }]
        });
    });
});
