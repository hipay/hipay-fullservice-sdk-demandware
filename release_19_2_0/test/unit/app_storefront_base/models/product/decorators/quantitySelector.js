'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

describe('quantity selector decorator', function () {
    var quantities = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/product/decorators/quantitySelector', {
        'dw/web/URLUtils': {
            url: function () {
                return {
                    relative: function () {
                        return {
                            toString: function () {
                                return 'string';
                            }
                        };
                    }
                };
            }
        },
        '*/cartridge/scripts/helpers/urlHelpers': {
            appendQueryParams: function () {
                return 'url';
            }
        }
    });

    it('should create a property on the passed in object called quantities', function () {
        var object = {
            minOrderQuantity: 1,
            maxOrderQuantity: 10,
            selectedQuantity: 2,
            id: 'someID'
        };
        quantities(object, 1, {}, []);
        assert.equal(object.quantities.length, 10);
    });

    it('should handle selected quantity being null', function () {
        var object = {
            minOrderQuantity: 1,
            maxOrderQuantity: 10,
            selectedQuantity: null,
            id: 'someID'
        };

        quantities(object, 1, {}, []);
        assert.equal(object.quantities.length, 10);
    });

    it('should handle null attributes', function () {
        var object = {
            minOrderQuantity: 1,
            maxOrderQuantity: 10,
            selectedQuantity: null,
            id: 'someID'
        };

        quantities(object, 1, null, null);
        assert.equal(object.quantities.length, 10);
    });
});
