'use strict';

var assert = require('chai').assert;

describe('product is online decorator', function () {
    var online = require('../../../../../../cartridges/app_storefront_base/cartridge/models/product/decorators/online');

    var apiProductMock = {
        online: true
    };

    var apiProductMock2 = {};

    it('should return true property for passed in object', function () {
        var object = {};
        online(object, apiProductMock);
        assert.equal(object.online, true);
    });

    it('should return false property for passed in object', function () {
        var object = {};
        online(object, apiProductMock2);
        assert.equal(object.online, false);
    });
});
