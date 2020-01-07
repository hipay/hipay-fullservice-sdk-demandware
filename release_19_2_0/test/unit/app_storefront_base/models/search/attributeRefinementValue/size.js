'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();


describe('SizeAttributeValue model', function () {
    var productSearch = {};
    var refinementDefinition = {};
    var refinementValue = {};
    var sizeAttributeValue = {};

    var SizeAttributeValue = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/search/attributeRefinementValue/size', {
        '*/cartridge/models/search/attributeRefinementValue/base': proxyquire(
            '../../../../../../cartridges/app_storefront_base/cartridge/models/search/attributeRefinementValue/base', {
                'dw/web/Resource': {
                    msgf: function () { return 'some product title'; }
                }
            }
        )
    });

    it('should instantiate a Size Attribute Value model', function () {
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
            presentationID: 'presentationId mock',
            value: 'some value',
            displayValue: 'some display value',
            hitCount: 10
        };
        sizeAttributeValue = new SizeAttributeValue(productSearch, refinementDefinition, refinementValue);

        assert.deepEqual(sizeAttributeValue, {
            id: 'product 1',
            type: 'size',
            displayValue: 'some display value',
            presentationId: 'presentationId mock',
            selected: true,
            selectable: true,
            title: 'some product title',
            url: 'relax url'
        });
    });
});
