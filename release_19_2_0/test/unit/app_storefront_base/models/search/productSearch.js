'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var sinon = require('sinon');
var mockCollections = require('../../../../mocks/util/collections');

describe('ProductSearch model', function () {
    var endpointSearchShow = 'Search-Show';
    var endpointSearchUpdateGrid = 'Search-UpdateGrid';
    var pluckValue = 'plucked';
    var spySetPageSize = sinon.spy();
    var spySetStart = sinon.spy();
    var stubAppendPaging = sinon.stub();
    var stubGetPageSize = sinon.stub();
    var stubAppendQueryParams = sinon.stub();
    stubAppendQueryParams.returns({ toString: function () {} });

    var defaultPageSize = 12;
    var pagingModelInstance = {
        appendPaging: stubAppendPaging,
        getPageSize: stubGetPageSize,
        getEnd: function () { return 10; },
        setPageSize: spySetPageSize,
        setStart: spySetStart
    };
    var stubPagingModel = sinon.stub();
    var refinementValues = [{
        value: 1,
        selected: false
    }, {
        value: 2,
        selected: true
    }, {
        value: 3,
        selected: false
    }];
    var ProductSearch = proxyquire('../../../../../cartridges/app_storefront_base/cartridge/models/search/productSearch', {
        '*/cartridge/scripts/util/collections': {
            map: mockCollections.map,
            pluck: function () { return pluckValue; }
        },
        '*/cartridge/scripts/factories/searchRefinements': {
            get: function () { return refinementValues; }
        },
        '*/cartridge/models/search/productSortOptions': proxyquire('../../../../../cartridges/app_storefront_base/cartridge/models/search/productSortOptions', {
            '*/cartridge/scripts/util/collections': {
                map: mockCollections.map
            },
            '*/cartridge/scripts/helpers/urlHelpers': {
                appendQueryParams: function () {}
            }
        }),
        '*/cartridge/scripts/helpers/urlHelpers': {
            appendQueryParams: stubAppendQueryParams
        },
        'dw/web/URLUtils': {
            url: function (endpoint, param, value) { return [endpoint, param, value].join(' '); }
        },
        'dw/web/PagingModel': stubPagingModel,
        '*/cartridge/config/preferences': require('../../../../mocks/config/preferences')
    });

    var apiProductSearch;
    var httpParams = {};
    var result = '';

    stubPagingModel.returns(pagingModelInstance);
    stubGetPageSize.returns(defaultPageSize);

    afterEach(function () {
        spySetStart.reset();
        spySetPageSize.reset();
        stubAppendQueryParams.reset();
    });

    describe('.getRefinements()', function () {
        var displayName = 'zodiac sign';
        var categoryRefinement = { cat: 'catRefinement' };
        var attrRefinement = { attr: 'attrRefinement' };

        beforeEach(function () {
            apiProductSearch = {
                isCategorySearch: false,
                refinements: {
                    refinementDefinitions: [{
                        displayName: displayName,
                        categoryRefinement: categoryRefinement,
                        attributeRefinement: attrRefinement,
                        values: refinementValues
                    }],
                    getAllRefinementValues: function () {}
                },
                url: function () { return 'http://some.url'; }
            };
        });

        it('should return refinements with a display name', function () {
            result = new ProductSearch(apiProductSearch, httpParams, 'sorting-rule-1', [], {});
            assert.deepEqual(result.refinements[0].displayName, displayName);
        });

        it('should return refinements with a categoryRefinement value', function () {
            result = new ProductSearch(apiProductSearch, httpParams, 'sorting-rule-1', [], {});
            assert.deepEqual(result.refinements[0].isCategoryRefinement, categoryRefinement);
        });

        it('should return refinements with an attribute refinement value', function () {
            result = new ProductSearch(apiProductSearch, httpParams, 'sorting-rule-1', [], {});
            assert.deepEqual(result.refinements[0].isAttributeRefinement, attrRefinement);
        });

        it('should return an object with refinement values', function () {
            result = new ProductSearch(apiProductSearch, httpParams, 'sorting-rule-1', [], {});
            assert.deepEqual(result.refinements[0].values, refinementValues);
        });
    });

    describe('.getSelectedFilters()', function () {
        beforeEach(function () {
            apiProductSearch = {
                isCategorySearch: false,
                refinements: {
                    refinementDefinitions: [{}],
                    getAllRefinementValues: function () {}
                },
                url: function () { return 'http://some.url'; }
            };
        });

        it('should retrieve filter values that have been selected', function () {
            var selectedFilter = refinementValues.find(function (value) { return value.selected === true; });
            result = new ProductSearch(apiProductSearch, httpParams, 'sorting-rule-1', [], {});
            assert.equal(result.selectedFilters[0], selectedFilter);
        });

        it('should retrieve filter values that have been selected', function () {
            var selectedFilter = refinementValues.find(function (value) { return value.selected === true; });
            result = new ProductSearch(apiProductSearch, httpParams, 'sorting-rule-1', [], {});
            assert.equal(result.selectedFilters[0], selectedFilter);
        });
    });

    describe('.getResetLink()', function () {
        var expectedLink = '';

        beforeEach(function () {
            apiProductSearch = {
                categorySearch: false,
                refinements: {
                    refinementDefinitions: []
                },
                url: function () { return 'http://some.url'; }
            };

            httpParams = {
                cgid: 'cat123',
                q: 'keyword'
            };
        });

        it('should return a reset link for keyword searches', function () {
            expectedLink = [endpointSearchShow, 'q', httpParams.q].join(' ');
            result = new ProductSearch(apiProductSearch, httpParams, 'sorting-rule-1', [], {});
            assert.equal(result.resetLink, expectedLink);
        });

        it('should return a reset link for category searches', function () {
            apiProductSearch.categorySearch = true;
            expectedLink = [endpointSearchShow, 'cgid', httpParams.cgid].join(' ');
            result = new ProductSearch(apiProductSearch, httpParams, 'sorting-rule-1', [], {});
            assert.equal(result.resetLink, expectedLink);
        });
    });

    describe('.getBannerImageUrl()', function () {
        var slotImageUrl = 'http://slot.banner.image.url';
        var nonSlotImageUrl = 'http://image.url';

        beforeEach(function () {
            apiProductSearch = {
                refinements: {
                    refinementDefinitions: []
                },
                url: function () { return 'http://some.url'; },
                category: {
                    custom: {
                        slotBannerImage: {
                            getURL: function () {
                                return slotImageUrl;
                            }
                        }
                    },
                    image: {
                        getURL: function () {
                            return nonSlotImageUrl;
                        }
                    }
                }
            };
        });

        it('should use a slot image for a category banner if specified', function () {
            result = new ProductSearch(apiProductSearch, httpParams, 'sorting-rule-1', [], {});
            assert.equal(result.bannerImageUrl, slotImageUrl);
        });

        it('should use a regular image for its banner image if no slot image specified', function () {
            apiProductSearch.category.custom = null;
            result = new ProductSearch(apiProductSearch, httpParams, 'sorting-rule-1', [], {});
            assert.equal(result.bannerImageUrl, nonSlotImageUrl);
        });
    });

    describe('.getPagingModel()', function () {
        beforeEach(function () {
            apiProductSearch = {
                isCategorySearch: false,
                refinements: {
                    refinementDefinitions: []
                },
                url: function () { return 'http://some.url'; }
            };
        });

        it('should call the PagingModel.setStart() method', function () {
            result = new ProductSearch(apiProductSearch, httpParams, 'sorting-rule-1', [], {});
            assert.isTrue(spySetStart.called);
        });

        it('should call the PagingModel.setPageSize() method', function () {
            result = new ProductSearch(apiProductSearch, httpParams, 'sorting-rule-1', [], {});
            assert.isTrue(spySetPageSize.called);
        });
    });

    describe('.getShowMoreUrl()', function () {
        var currentPageSize = 12;
        var expectedUrl = 'some url';

        beforeEach(function () {
            apiProductSearch = {
                isCategorySearch: false,
                refinements: {
                    refinementDefinitions: []
                },
                url: function () { return endpointSearchUpdateGrid; }
            };

            stubGetPageSize.returns(currentPageSize);
            stubAppendPaging.returns(expectedUrl);
        });

        afterEach(function () {
            stubGetPageSize.reset();
        });

        it('should return a url string if not on final results page', function () {
            expectedUrl = 'some url';
            apiProductSearch.count = 14;
            result = new ProductSearch(apiProductSearch, httpParams, 'sorting-rule-1', [], {});
            assert.equal(result.showMoreUrl, expectedUrl);
        });

        it('should return an empty string if last results page', function () {
            expectedUrl = '';
            apiProductSearch.count = 10;
            result = new ProductSearch(apiProductSearch, httpParams, 'sorting-rule-1', [], {});
            assert.equal(result.showMoreUrl, expectedUrl);
        });
    });

    describe('.getPermaLink()', function () {
        var expectedPermalink = 'permalink url';
        var mockToString = function () { return expectedPermalink; };
        stubAppendQueryParams.returns({ toString: mockToString });

        beforeEach(function () {
            httpParams = {
                start: '100'
            };
        });

        it('should produce a permalink URL', function () {
            result = new ProductSearch(apiProductSearch, httpParams, 'sorting-rule-1', [], {});
            assert.equal(result.permalink, expectedPermalink);
        });

        it('should append sz query param to a url = to start and default page size', function () {
            result = new ProductSearch(apiProductSearch, httpParams, 'sorting-rule-1', [], {});
            assert.isTrue(stubAppendQueryParams.calledWith(endpointSearchUpdateGrid));
            assert.deepEqual(stubAppendQueryParams.args[0][1], {
                start: '0',
                // start of 100 + default page size of 12
                sz: 112
            });
        });
    });
});
