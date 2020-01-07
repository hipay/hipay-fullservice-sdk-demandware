'use strict';

var assert = require('chai').assert;

describe('size chart decorator', function () {
    var sizeChart = require('../../../../../../cartridges/app_storefront_base/cartridge/models/product/decorators/sizeChart');

    it('should create someSizeChartID property for passed in object', function () {
        var object = {};
        sizeChart(object, 'someSizeChartID');

        assert.equal(object.sizeChartId, 'someSizeChartID');
    });
});
