'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var sinon = require('sinon');

describe('Helpers - URL', function () {
    var querystringStub = sinon.stub();
    var toStringMock = function () {
        var self = this;
        var params = Object.keys(this).reduce(function (current, key) {
            var value = self[key];
            if (typeof value !== 'function') {
                current.push(key + '=' + value);
            }
            return current;
        }, []);
        return params.join('&');
    };
    var target = 'http://abc?def=123';
    var queryParamsObject = { ghi: 456 };
    var queryParam = 'jkl=789';
    var queryParamNoVal = 'mno=';

    var urlHelpers = proxyquire('../../../../../cartridges/app_storefront_base/cartridge/scripts/helpers/urlHelpers', {
        'server': { querystring: querystringStub }
    });

    describe('appendQueryParams() function', function () {
        beforeEach(function () {
            querystringStub.reset()
                .withArgs(target)
                .returns({
                    def: 123,
                    toString: toStringMock
                })
                .withArgs(queryParam)
                .returns({
                    jkl: 789,
                    toString: toStringMock
                })
                .withArgs(queryParamNoVal)
                .returns({
                    mno: undefined,
                    toString: toStringMock
                });
        });

        it('should append an object\'s key/value pairs to a provided url', function () {
            var url = urlHelpers.appendQueryParams(target, queryParamsObject);
            assert.equal(url, 'http://abc?def=123&ghi=456');
        });

        it('should append a list of query strings to a provided url', function () {
            var url = urlHelpers.appendQueryParams(target, [queryParam]);
            assert.equal(url, 'http://abc?def=123&jkl=789');
        });

        it('should assign a query param to blank if value falsy to a provided url', function () {
            var url = urlHelpers.appendQueryParams(target, [queryParamNoVal]);
            assert.equal(url, 'http://abc?def=123&mno=');
        });
    });
});
