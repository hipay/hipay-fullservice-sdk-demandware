'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var sinon = require('sinon');


describe('Range Price Model', function () {
    var defaultPrice = sinon.spy();
    var RangePrice = proxyquire('../../../../../cartridges/app_storefront_base/cartridge/models/price/range.js', {
        '*/cartridge/models/price/default': defaultPrice
    });
    var minPrice = '$5';
    var maxPrice = '$15';

    it('should set type property value to "range"', function () {
        var rangePrice = new RangePrice(minPrice, maxPrice);
        assert.equal(rangePrice.type, 'range');
    });

    it('should set min property to a DefaultPrice instance', function () {
        new RangePrice(minPrice, maxPrice);
        assert.isTrue(defaultPrice.calledWithNew());
        assert.isTrue(defaultPrice.calledWith(minPrice));
        defaultPrice.reset();
    });

    it('should set max property to a DefaultPrice instance', function () {
        new RangePrice(minPrice, maxPrice);
        assert.isTrue(defaultPrice.calledWithNew());
        assert.isTrue(defaultPrice.calledWith(maxPrice));
        defaultPrice.reset();
    });
});
