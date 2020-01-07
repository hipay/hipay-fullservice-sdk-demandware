'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var sinon = require('sinon');
var ACTION_ENDPOINT_GRID = 'Search-Content';
var ACTION_ENDPOINT_CONTENT = 'Page-Show';
var DEFAULT_PAGE_SIZE = 12;
var QUERY_PHRASE = 'queryPhraseString';
var startingPage;
var stubPagingModel = sinon.stub();
var mockCollections = require('../../../../mocks/util/collections');

var contentAssets = [
    {
        name: 'name1',
        ID: 'ID1',
        description: 'description 1'
    }, {
        name: 'name2',
        ID: 'ID2',
        description: 'description 2'
    }, {
        name: 'name3',
        ID: 'ID3',
        description: 'description 3'
    }, {
        name: 'name4',
        ID: 'ID4',
        description: 'description 4'
    }, {
        name: 'name5',
        ID: 'ID5',
        description: 'description 5'
    }, {
        name: 'name6',
        ID: 'ID6',
        description: 'description 6'
    }, {
        name: 'name7',
        ID: 'ID7',
        description: 'description 7'
    }, {
        name: 'name8',
        ID: 'ID8',
        description: 'description 8'
    }, {
        name: 'name9',
        ID: 'ID9',
        description: 'description 9'
    }, {
        name: 'name10',
        ID: 'ID10',
        description: 'description 10'
    }, {
        name: 'name11',
        ID: 'ID11',
        description: 'description 11'
    }, {
        name: 'name12',
        ID: 'ID12',
        description: 'description 12'
    }, {
        name: 'name13',
        ID: 'ID13',
        description: 'description 13'
    }
];

var expectedResultpage1 = {
    queryPhrase: 'queryPhraseString',
    contents: [
        {
            name: 'name1',
            url: ACTION_ENDPOINT_CONTENT + ' cid ID1',
            description: 'description 1'
        }, {
            name: 'name2',
            url: ACTION_ENDPOINT_CONTENT + ' cid ID2',
            description: 'description 2'
        }, {
            name: 'name3',
            url: ACTION_ENDPOINT_CONTENT + ' cid ID3',
            description: 'description 3'
        }, {
            name: 'name4',
            url: ACTION_ENDPOINT_CONTENT + ' cid ID4',
            description: 'description 4'
        }, {
            name: 'name5',
            url: ACTION_ENDPOINT_CONTENT + ' cid ID5',
            description: 'description 5'
        }, {
            name: 'name6',
            url: ACTION_ENDPOINT_CONTENT + ' cid ID6',
            description: 'description 6'
        }, {
            name: 'name7',
            url: ACTION_ENDPOINT_CONTENT + ' cid ID7',
            description: 'description 7'
        }, {
            name: 'name8',
            url: ACTION_ENDPOINT_CONTENT + ' cid ID8',
            description: 'description 8'
        }, {
            name: 'name9',
            url: ACTION_ENDPOINT_CONTENT + ' cid ID9',
            description: 'description 9'
        }, {
            name: 'name10',
            url: ACTION_ENDPOINT_CONTENT + ' cid ID10',
            description: 'description 10'
        }, {
            name: 'name11',
            url: ACTION_ENDPOINT_CONTENT + ' cid ID11',
            description: 'description 11'
        }, {
            name: 'name12',
            url: ACTION_ENDPOINT_CONTENT + ' cid ID12',
            description: 'description 12'
        }
    ],
    contentCount: 13,
    moreContentUrl: ACTION_ENDPOINT_GRID + ' q queryPhraseString',
    hasMessage: true
};

var expectedResultpage2 = {
    queryPhrase: 'queryPhraseString',
    contents: [
        {
            name: 'name13',
            url: ACTION_ENDPOINT_CONTENT + ' cid ID13',
            description: 'description 13'
        }
    ],
    contentCount: 13,
    moreContentUrl: null,
    hasMessage: false
};

var ContentSearch = proxyquire('../../../../../cartridges/app_storefront_base/cartridge/models/search/contentSearch.js', {
    'dw/web/URLUtils': {
        url: function (endpoint, param, value) { return [endpoint, param, value].join(' '); }
    },
    '*/cartridge/scripts/util/collections': {
        map: mockCollections.map
    },
    'dw/web/PagingModel': stubPagingModel,
    '*/cartridge/config/preferences': require('../../../../mocks/config/preferences')
});

var createApiContentSearchResult = function (queryPhrase, Page) {
    var index = 0;
    var contentIterator = {
        items: contentAssets,
        hasNext: function () {
            return index < contentAssets.length;
        },
        next: function () {
            return contentAssets[index++];
        }
    };
    return new ContentSearch(contentIterator, contentAssets.length, queryPhrase, Page, DEFAULT_PAGE_SIZE);
};

describe('ContentSearch model', function () {
    var index = 0;
    var theCurrentPage;

    var pagingModelInstance = {
        currentPage: undefined,
        setPageSize: function () {
        },
        setStart: function (startPage) {
            this.startPage = startPage;
            this.maxPage = Math.ceil(contentAssets.length / DEFAULT_PAGE_SIZE);
            index = startPage;
            theCurrentPage = Math.ceil((startPage + 1) / DEFAULT_PAGE_SIZE);
            this.currentPage = theCurrentPage;
        },
        startPage: undefined,
        maxPage: undefined,
        pageElements: {
            hasNext: function () {
                return index < contentAssets.length && index < DEFAULT_PAGE_SIZE * theCurrentPage;
            },
            next: function () {
                return contentAssets[index++];
            },
            asList: function () {
                return contentAssets.slice(startingPage, theCurrentPage * DEFAULT_PAGE_SIZE);
            }
        }
    };

    stubPagingModel.returns(pagingModelInstance);

    describe('First page of results', function () {
        beforeEach(function () {
            startingPage = 0;
        });

        it('should return a page worth of content', function () {
            var result = createApiContentSearchResult(QUERY_PHRASE, startingPage);
            assert.deepEqual(result, expectedResultpage1);
        });

        it('should return no more content then the page size value', function () {
            var result = createApiContentSearchResult(QUERY_PHRASE, startingPage);
            assert.isAtMost(result.contents.length, DEFAULT_PAGE_SIZE);
        });

        it('should return the total number of content', function () {
            var result = createApiContentSearchResult(QUERY_PHRASE, startingPage);
            assert.equal(contentAssets.length, result.contentCount);
        });

        it('should return a link for more content if there is more content to display', function () {
            var result = createApiContentSearchResult(QUERY_PHRASE, startingPage);
            assert.equal(expectedResultpage1.moreContentUrl, result.moreContentUrl);
            assert.isBelow(DEFAULT_PAGE_SIZE, result.contentCount);
        });
    });

    describe('Second / Last page of results', function () {
        beforeEach(function () {
            startingPage = 0;
            startingPage += DEFAULT_PAGE_SIZE;
        });

        it('should return the second page worth of content', function () {
            var result = createApiContentSearchResult(QUERY_PHRASE, startingPage);
            assert.deepEqual(result, expectedResultpage2);
        });

        it('should return less content then the page size for the last page', function () {
            var result = createApiContentSearchResult(QUERY_PHRASE, startingPage + DEFAULT_PAGE_SIZE);
            assert.isAtMost(result.contents.length, DEFAULT_PAGE_SIZE);
        });

        it('should return the total number of content', function () {
            var result = createApiContentSearchResult(QUERY_PHRASE, startingPage + DEFAULT_PAGE_SIZE);
            assert.equal(contentAssets.length, result.contentCount);
        });

        it('should return null if there is there is no more content to display', function () {
            var result = createApiContentSearchResult(QUERY_PHRASE, startingPage + DEFAULT_PAGE_SIZE);
            assert.equal(expectedResultpage2.moreContentUrl, result.moreContentUrl);
            assert.isBelow(DEFAULT_PAGE_SIZE, result.contentCount);
        });
    });
});
