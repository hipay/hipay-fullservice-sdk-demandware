'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

describe('product line item price total decorator', function () {
    var renderedPromotions = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/productLineItem/decorators/renderedPromotions', {
        '*/cartridge/scripts/renderTemplateHelper': {
            getRenderedHtml: function () { return 'rendered HTML'; }
        }
    });

    it('should create renderedPromotions property for passed in object', function () {
        var object = {};
        object.appliedPromotions = {};
        renderedPromotions(object);

        assert.equal(object.renderedPromotions, 'rendered HTML');
    });

    it('should handle no applied promotions', function () {
        var object = {};
        renderedPromotions(object);

        assert.equal(object.renderedPromotions, '');
    });
});
