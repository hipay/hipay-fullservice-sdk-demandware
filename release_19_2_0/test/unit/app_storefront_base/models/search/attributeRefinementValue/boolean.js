'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();


describe('BooleanAttributeValue model', function () {
    var refinementDefinition = {};
    var booleanAttributeValue = {};

    var BooleanAttributeValue = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/search/attributeRefinementValue/boolean', {
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
        urlRelaxAttributeValue: function () {
            return {
                relative: function () {
                    return {
                        toString: function () { return 'relax url'; }
                    };
                }
            };
        },
        urlRefineAttributeValue: function () {
            return {
                relative: function () {
                    return {
                        toString: function () { return 'select url'; }
                    };
                }
            };
        }
    };
    var refinementValue = {
        ID: 'product 1',
        presentationID: 'prez',
        value: 'some value',
        displayValue: 'some display value',
        hitCount: 10
    };

    it('should instantiate a Boolean Attribute Value model', function () {
        booleanAttributeValue = new BooleanAttributeValue(productSearch, refinementDefinition, refinementValue);

        assert.deepEqual(booleanAttributeValue, {
            id: 'product 1',
            type: 'boolean',
            displayValue: 'some display value',
            selected: true,
            selectable: true,
            title: 'some product title',
            url: 'relax url'
        });
    });

    it('should instantiate a unselected Boolean Attribute Value model', function () {
        productSearch.isRefinedByAttributeValue = function () { return false; };
        booleanAttributeValue = new BooleanAttributeValue(productSearch, refinementDefinition, refinementValue);

        assert.deepEqual(booleanAttributeValue, {
            id: 'product 1',
            type: 'boolean',
            displayValue: 'some display value',
            selected: false,
            selectable: true,
            title: 'some product title',
            url: 'select url'
        });
    });

    it('should instantiate a unselectable Boolean Attribute Value model', function () {
        productSearch.isRefinedByAttributeValue = function () { return false; };
        refinementValue.hitCount = 0;
        booleanAttributeValue = new BooleanAttributeValue(productSearch, refinementDefinition, refinementValue);

        assert.deepEqual(booleanAttributeValue, {
            id: 'product 1',
            type: 'boolean',
            displayValue: 'some display value',
            selected: false,
            selectable: false,
            title: 'some product title',
            url: '#'
        });
    });
});
