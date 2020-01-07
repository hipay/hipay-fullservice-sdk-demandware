'use strict';

var assert = require('chai').assert;

describe('product rating decorator', function () {
    var rating = require('../../../../../../cartridges/app_storefront_base/cartridge/models/product/decorators/ratings');

    it('should create rating property for passed in object', function () {
        var object = {
            id: '1234567'
        };
        rating(object);

        assert.equal(object.rating, 4.5);
    });
});
