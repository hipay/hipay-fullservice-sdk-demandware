'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();


describe('CategoryAttributeValue model', function () {
    var refinementDefinition = {};
    var booleanAttributeValue = {};

    var CategoryAttributeValue = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/search/attributeRefinementValue/category', {
        '*/cartridge/models/search/attributeRefinementValue/base': proxyquire(
            '../../../../../../cartridges/app_storefront_base/cartridge/models/search/attributeRefinementValue/base', {
                'dw/web/Resource': {
                    msgf: function () { return 'some product title'; }
                }
            }
        ),
        'dw/web/Resource': {
            msg: function () { return 'some display value'; }
        }
    });

    var productSearch = {
        isRefinedByAttributeValue: function () { return true; },
        urlRefineCategory: function () {
            return {
                relative: function () {
                    return {
                        toString: function () { return 'category url'; }
                    };
                }
            };
        }
    };
    var refinementValue = {
        ID: 'product 1',
        presentationID: 'prez',
        value: 'some value',
        displayName: 'some display value',
        hitCount: 10
    };

    it('should instantiate a selected root Category Attribute Value model', function () {
        booleanAttributeValue = new CategoryAttributeValue(productSearch, refinementDefinition, refinementValue, true);

        assert.deepEqual(booleanAttributeValue, {
            id: 'product 1',
            type: 'category',
            displayValue: 'some display value',
            selected: true,
            selectable: true,
            title: 'some product title',
            url: 'category url',
            subCategories: []
        });
    });

    it('should instantiate a selected non-root Category Attribute Value model', function () {
        productSearch.category = {
            parent: {
                ID: 'test'
            }
        };

        booleanAttributeValue = new CategoryAttributeValue(productSearch, refinementDefinition, refinementValue, true);

        assert.deepEqual(booleanAttributeValue, {
            id: 'product 1',
            type: 'category',
            displayValue: 'some display value',
            selected: true,
            selectable: true,
            title: 'some product title',
            url: 'category url',
            subCategories: []
        });
    });

    it('should instantiate a unselected Category Attribute Value model', function () {
        booleanAttributeValue = new CategoryAttributeValue(productSearch, refinementDefinition, refinementValue, false);

        assert.deepEqual(booleanAttributeValue, {
            id: 'product 1',
            type: 'category',
            displayValue: 'some display value',
            selected: false,
            selectable: true,
            title: 'some product title',
            url: 'category url',
            subCategories: []
        });
    });
});
