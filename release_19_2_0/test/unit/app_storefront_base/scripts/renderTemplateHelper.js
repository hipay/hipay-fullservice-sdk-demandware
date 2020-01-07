'use strict';

var assert = require('chai').assert;
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();
var sinon = require('sinon');

describe('renderTemplateHelper', function () {
    var templateStub = sinon.stub();
    var renderTemplateHelper = proxyquire('../../../../cartridges/app_storefront_base/cartridge/scripts/renderTemplateHelper.js', {
        'dw/util/Template': templateStub,
        'dw/util/HashMap': function () {
            return {
                result: {},
                put: function (key, context) {
                    this.result[key] = context;
                }
            };
        }
    });

    it('should the isml template html', function () {
        var context = { test: 'test' };
        var templateName = 'productCardProductRenderedTotalPrice';

        templateStub.returns({
            render: function () {
                return { text: 'rendered html' };
            }
        });

        var result = renderTemplateHelper.getRenderedHtml(context, templateName);
        assert.equal(result, 'rendered html');
        assert.isTrue(templateStub.calledWith(templateName));
        templateStub.reset();
    });
});

