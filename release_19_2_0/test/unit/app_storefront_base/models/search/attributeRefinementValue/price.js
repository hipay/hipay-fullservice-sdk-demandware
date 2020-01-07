'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();


describe('PriceAttributeValue model', function () {
    var refinementDefinition = {};
    var priceAttributeValue = {};

    var PriceAttributeValue = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/search/attributeRefinementValue/price', {
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
        isRefinedByPriceRange: function () { return true; },
        urlRelaxPrice: function () {
            return {
                relative: function () {
                    return {
                        toString: function () { return 'relax url'; }
                    };
                }
            };
        },
        urlRefinePrice: function () {
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

    it('should instantiate a Price Attribute Value model', function () {
        priceAttributeValue = new PriceAttributeValue(productSearch, refinementDefinition, refinementValue);

        assert.deepEqual(priceAttributeValue, {
            displayValue: 'some display value',
            selected: true,
            title: 'some product title',
            url: 'relax url'
        });
    });

    it('should instantiate an unselected Price Attribute Value model', function () {
        productSearch.isRefinedByPriceRange = function () {
            return false;
        };
        priceAttributeValue = new PriceAttributeValue(productSearch, refinementDefinition, refinementValue);

        assert.deepEqual(priceAttributeValue, {
            displayValue: 'some display value',
            selected: false,
            title: 'some product title',
            url: 'select url'
        });
    });
});
