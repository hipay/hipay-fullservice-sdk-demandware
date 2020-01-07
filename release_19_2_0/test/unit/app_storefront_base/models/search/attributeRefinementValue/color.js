'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();


describe('ColorAttributeValue model', function () {
    var productSearch = {};
    var refinementDefinition = {};
    var refinementValue = {};
    var colorAttributeValue = {};

    var ColorAttributeValue = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/search/attributeRefinementValue/color', {
        '*/cartridge/models/search/attributeRefinementValue/base': proxyquire(
            '../../../../../../cartridges/app_storefront_base/cartridge/models/search/attributeRefinementValue/base', {
                'dw/web/Resource': {
                    msgf: function () { return 'some product title'; }
                }
            }
        )
    });

    it('should instantiate a Color Attribute Value model', function () {
        productSearch = {
            isRefinedByAttributeValue: function () { return true; },
            urlRelaxAttributeValue: function () {
                return {
                    relative: function () {
                        return {
                            toString: function () { return 'relax url'; }
                        };
                    }
                };
            }
        };
        refinementValue = {
            ID: 'product 1',
            presentationID: 'prez',
            value: 'some value',
            displayValue: 'some display value',
            hitCount: 10
        };
        colorAttributeValue = new ColorAttributeValue(productSearch, refinementDefinition, refinementValue);

        assert.deepEqual(colorAttributeValue, {
            id: 'product 1',
            type: 'color',
            displayValue: 'some display value',
            presentationId: 'prez',
            selected: true,
            selectable: true,
            swatchId: 'swatch-circle-prez',
            title: 'some product title',
            url: 'relax url'
        });
    });
});
