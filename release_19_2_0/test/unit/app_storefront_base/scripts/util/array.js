'use strict';

var assert = require('chai').assert;
var array = require('../../../../../cartridges/app_storefront_base/cartridge/scripts/util/array');

describe('Array utilities', function () {
    describe('find() function', function () {
        it('should find a match', function () {
            var result = array.find([1, 2, 3, 10, 115], function (item) {
                return item > 100;
            });

            assert.equal(result, 115);
        });

        it('should not find any matches', function () {
            var result = array.find([1, 2, 3, 10, 25], function (item) {
                return item > 100;
            });

            assert.isUndefined(result);
        });
    });
});
