'use strict';

var assert = require('chai').assert;
var ArrayList = require('../../../mocks/dw.util.Collection');
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var urlUtilsMock = {
    url: function (a, b, id) {
        return id;
    }
};

var createApiCategory = function (name, id, hasOnlineSubCategories, hasOnlineProducts) {
    return {
        custom: {
            showInMenu: true
        },
        hasOnlineSubCategories: function () {
            return hasOnlineSubCategories;
        },
        hasOnlineProducts: function () {
            return hasOnlineProducts;
        },
        getDisplayName: function () {
            return name;
        },
        getOnlineSubCategories: function () {
            return new ArrayList([]);
        },
        getID: function () {
            return id;
        }
    };
};

describe('categories', function () {
    var Categories = null;
    beforeEach(function () {
        var collections = proxyquire('../../../../cartridges/app_storefront_base/cartridge/scripts/util/collections', {
            'dw/util/ArrayList': ArrayList
        });
        Categories = proxyquire('../../../../cartridges/app_storefront_base/cartridge/models/categories', {
            '*/cartridge/scripts/util/collections': collections,
            'dw/web/URLUtils': urlUtilsMock
        });
    });
    it('should convert API response to an object', function () {
        var apiCategories = new ArrayList([createApiCategory('foo', 1, true, true)]);

        var result = new Categories(apiCategories);
        assert.equal(result.categories.length, 1);
        assert.equal(result.categories[0].name, 'foo');
        assert.equal(result.categories[0].url, 1);
    });
    it('should convert API response to nested object', function () {
        var category = createApiCategory('foo', 1, true, true);
        category.getOnlineSubCategories = function () {
            return new ArrayList([createApiCategory('bar', 2, true, true), createApiCategory('baz', 3, true, true)]);
        };

        var result = new Categories(new ArrayList([category]));
        assert.equal(result.categories.length, 1);
        assert.equal(result.categories[0].name, 'foo');
        assert.equal(result.categories[0].url, 1);
        assert.equal(result.categories[0].subCategories.length, 2);
        assert.isFalse(result.categories[0].complexSubCategories);
        assert.equal(result.categories[0].subCategories[0].name, 'bar');
        assert.equal(result.categories[0].subCategories[1].name, 'baz');
    });
    it('should convertAPI response to object with complex sub category', function () {
        var category = createApiCategory('foo', 1, true, true);
        category.getOnlineSubCategories = function () {
            var child = createApiCategory('bar', 2, true, true);
            child.getOnlineSubCategories = function () {
                return new ArrayList([createApiCategory('baz', 3, true, true)]);
            };
            return new ArrayList([child]);
        };

        var result = new Categories(new ArrayList([category]));
        assert.equal(result.categories.length, 1);
        assert.equal(result.categories[0].subCategories.length, 1);
        assert.isTrue(result.categories[0].complexSubCategories);
        assert.equal(result.categories[0].subCategories[0].name, 'bar');
        assert.equal(result.categories[0].subCategories[0].subCategories[0].name, 'baz');
    });
    it('should not show menu that hasOnlineSubCategories and hasOnlineProducts return false', function () {
        var category = createApiCategory('foo', 1, true, false);
        category.getOnlineSubCategories = function () {
            var child = createApiCategory('bar', 2, false, false);
            return new ArrayList([child]);
        };

        var result = new Categories(new ArrayList([category]));
        assert.equal(result.categories.length, 1);
        assert.equal(result.categories[0].name, 'foo');
        assert.isUndefined(result.categories[0].subCategories);
    });
    it('should not show menu that is marked as showInMenu false', function () {
        var category = createApiCategory('foo', 1, true, true);
        category.getOnlineSubCategories = function () {
            var child = createApiCategory('bar', 2, true, true);
            child.getOnlineSubCategories = function () {
                var subChild = createApiCategory('baz', 3, true, true);
                subChild.custom.showInMenu = false;
                return new ArrayList([subChild]);
            };
            return new ArrayList([child]);
        };

        var result = new Categories(new ArrayList([category]));
        assert.equal(result.categories.length, 1);
        assert.equal(result.categories[0].subCategories.length, 1);
        assert.isFalse(result.categories[0].complexSubCategories);
        assert.equal(result.categories[0].subCategories[0].name, 'bar');
        assert.isUndefined(result.categories[0].subCategories[0].subCategories);
    });
    it('should use alternativeUrl', function () {
        var category = createApiCategory('foo', 1, true, true);
        category.custom.alternativeUrl = 22;
        var apiCategories = new ArrayList([category]);

        var result = new Categories(apiCategories);
        assert.equal(result.categories.length, 1);
        assert.equal(result.categories[0].name, 'foo');
        assert.equal(result.categories[0].url, 22);
    });
    it('should not return any categories', function () {
        var category = createApiCategory('foo', 1, true, true);
        category.custom.showInMenu = false;
        var apiCategories = new ArrayList([category]);

        var result = new Categories(apiCategories);
        assert.equal(result.categories.length, 0);
    });
});
