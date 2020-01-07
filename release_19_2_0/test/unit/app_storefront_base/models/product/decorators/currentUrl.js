'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var variationModelMock = {
    url: function () {
        return { relative: function () { return { toString: function () { return 'some string url'; } }; } };
    }
};
var optionModelMock = {};
var endpoint = 'some end point';
var id = 'some id';
var quantity = 1;

describe('selected product url decorator', function () {
    var currentUrl = proxyquire('../../../../../../cartridges/app_storefront_base/cartridge/models/product/decorators/currentUrl', {
        '*/cartridge/scripts/helpers/productHelpers': {
            getSelectedOptionsUrl: function () { return 'Some-EndPoint?dwopt_sony-kdl-70xbr7_tvWarranty=000&pid=sony-kdl-70xbr7'; }
        },
        '*/cartridge/scripts/helpers/urlHelpers': {
            appendQueryParams: function () { return 'Target URL appended with query params from sourceQueryString'; }
        },
        'dw/web/URLUtils': {
            url: function () {
                return { relative: function () { return { toString: function () { return 'some string url'; } }; } };
            }
        }
    });

    it('should create a property on the passed in object called selectedProductUrl', function () {
        var object = {};
        currentUrl(object, variationModelMock, optionModelMock, endpoint, id, quantity);

        assert.equal(object.selectedProductUrl, 'Target URL appended with query params from sourceQueryString');
    });

    it('selectedProductUrl when no endpoint is passed in', function () {
        var object = {};
        currentUrl(object, variationModelMock, optionModelMock, null, id, quantity);

        assert.equal(object.selectedProductUrl, 'Target URL appended with query params from sourceQueryString');
    });

    it('selectedProductUrl when no variation model is passed in', function () {
        var object = {};
        currentUrl(object, null, optionModelMock, null, id, quantity);

        assert.equal(object.selectedProductUrl, 'Target URL appended with query params from sourceQueryString');
    });
});
