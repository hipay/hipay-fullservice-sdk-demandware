'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

describe('format number', function () {
    var formatHelpers = proxyquire('../../../../../cartridges/app_storefront_base/cartridge/scripts/helpers/formatHelpers', {
        'dw/util/StringUtils': {
            formatNumber: function () {
                return 'formatted number';
            }
        }
    });

    it('should format a number', function () {
        var result = formatHelpers.formatNumber(100.1);
        assert.equal(result, 'formatted number');
    });

    it('should format a price', function () {
        var result = formatHelpers.formatPrice(100.1);
        assert.equal(result, 'formatted number');
    });
});
