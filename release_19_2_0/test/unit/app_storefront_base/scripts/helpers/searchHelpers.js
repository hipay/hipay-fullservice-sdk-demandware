var assert = require('chai').assert;
var searchHelperPath = '../../../../../cartridges/app_storefront_base/cartridge/scripts/helpers/searchHelpers';
var searchHelpers = require(searchHelperPath);
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var sinon = require('sinon');

describe('search helpers', function () {
    describe('get category template', function () {
        it('should return a template', function () {
            var mockApiProductSearch = {
                category: {
                    template: 'rendering/category/catLanding'
                }
            };
            var categoryTemplate = searchHelpers.getCategoryTemplate(mockApiProductSearch);
            assert.equal(categoryTemplate, 'rendering/category/catLanding');
        });

        it('should return no template', function () {
            var mockApiProductSearch = { category: null };
            var categoryTemplate = searchHelpers.getCategoryTemplate(mockApiProductSearch);
            assert.equal(categoryTemplate, '');
        });
    });

    describe('setup search', function () {
        var mockApiProductSearch = {};
        var mockParams1 = { srule: 'bestsellers', cgid: 'mens' };
        var mockParams2 = { srule: 'bestsellers', cgid: 'mens', preferences: { prefn1: 'pref1Value' } };
        var mockSelectedCategory = { ID: 'mens', online: true };

        var setProductPropertiesSpy = sinon.spy();
        var addRefinementValuesSpy = sinon.spy();

        var searchHelpersMock = proxyquire(searchHelperPath, {
            'dw/catalog/CatalogMgr': {
                getSortingRule: function (srule) {
                    return srule;
                },
                getCategory: function () {
                    return mockSelectedCategory;
                }
            },
            '*/cartridge/scripts/search/search': {
                setProductProperties: setProductPropertiesSpy,
                addRefinementValues: addRefinementValuesSpy
            }
        });


        it('should call setProductProperties', function () {
            searchHelpersMock.setupSearch(mockApiProductSearch, mockParams1);
            assert.isTrue(setProductPropertiesSpy.calledWith(mockApiProductSearch, mockParams1, mockSelectedCategory, mockParams2.srule));
            assert.isTrue(addRefinementValuesSpy.notCalled);
        });

        it('should call both setProductProperties & addRefinementValues', function () {
            searchHelpersMock.setupSearch(mockApiProductSearch, mockParams2);
            assert.isTrue(setProductPropertiesSpy.calledWith(mockApiProductSearch, mockParams1, mockSelectedCategory, mockParams2.srule));
            assert.isTrue(addRefinementValuesSpy.calledWith(mockApiProductSearch, mockParams2.preferences));
        });
    });

    describe('setup content search', function () {
        var mockParams = { q: 'denim', startingPage: 0 };

        var setRecursiveFolderSearchSpy = sinon.spy();
        var setSearchPhraseSpy = sinon.spy();
        var searchSpy = sinon.spy();
        var contentSearchSpy = sinon.spy();
        var searchHelpersMock2 = proxyquire(searchHelperPath, {
            'dw/content/ContentSearchModel': function () {
                return {
                    setRecursiveFolderSearch: setRecursiveFolderSearchSpy,
                    setSearchPhrase: setSearchPhraseSpy,
                    search: searchSpy,
                    getContent: function () {
                        return ['jeans', 'shorts'];
                    },
                    getCount: function () { return 2; }
                };
            },
            '*/cartridge/models/search/contentSearch': contentSearchSpy
        });

        searchHelpersMock2.setupContentSearch(mockParams);

        it('should set setRecursiveFolderSearch to true', function () {
            assert.isTrue(setRecursiveFolderSearchSpy.calledWith(true));
        });
        it('should set setSearchPhrase', function () {
            assert.isTrue(setSearchPhraseSpy.calledWith(mockParams.q));
        });
        it('should call search', function () {
            assert.isTrue(searchSpy.called);
        });
        it('should call ContentSearch', function () {
            assert.isTrue(contentSearchSpy.calledWith(['jeans', 'shorts'], 2, 'denim', 0, null));
        });
    });
});
