'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var ArrayList = require('../../../../mocks/dw.util.Collection');
var sinon = require('sinon');


describe('Helpers - Pricing', function () {
    var templateStub = sinon.stub();
    var collections = proxyquire('../../../../../cartridges/app_storefront_base/cartridge/scripts/util/collections', {
        'dw/util/ArrayList': ArrayList
    });

    var priceHelper = proxyquire('../../../../../cartridges/app_storefront_base/cartridge/scripts/helpers/pricing.js', {
        'dw/util/HashMap': function () {
            return {
                result: {},
                put: function (key, context) {
                    this.result[key] = context;
                }
            };
        },
        'dw/value/Money': function () {},
        'dw/util/Template': templateStub,
        '*/cartridge/scripts/util/collections': collections
    });

    describe('getHtmlContext', function () {
        var keyMap = {
            candy: 'chocolate',
            snack: 'chips'
        };

        it('should convert an object to a HashMap', function () {
            var context = priceHelper.getHtmlContext(keyMap);
            assert.deepEqual(context.result, keyMap);
        });
    });

    describe('getRootPriceBook', function () {
        var rootPriceBook = { title: 'I am the root pricebook' };
        var leafPriceBook = {
            parentPriceBook: {
                parentPriceBook: rootPriceBook
            }
        };

        it('should return the root price book', function () {
            var priceBook = priceHelper.getRootPriceBook(leafPriceBook);
            assert.equal(priceBook, rootPriceBook);
        });
    });

    describe('renderHtml', function () {
        var context = 'context';
        var renderedHtml = 'rendered';
        var defaultTemplatePath = 'product/components/pricing/ajaxMain.isml';

        beforeEach(function () {
            templateStub.returns({
                render: function () {
                    return { text: renderedHtml };
                }
            });
        });

        afterEach(function () {
            templateStub.reset();
        });

        it('should render template html', function () {
            var html = priceHelper.renderHtml(context);
            assert.equal(html, renderedHtml);
        });

        it('should instantiate template with default path when path not provided', function () {
            priceHelper.renderHtml(context);
            assert.isTrue(templateStub.calledWith(defaultTemplatePath));
        });

        it('should instantiate template with override path when provided', function () {
            var templatePathOverride = '/custom/path';
            priceHelper.renderHtml(context, templatePathOverride);
            assert.isTrue(templateStub.calledWith(templatePathOverride));
        });
    });
});
