'use strict';

var assert = require('chai').assert;
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru().noPreserveCache();

var pageMetaDataMiddleware = proxyquire('../../../../../cartridges/app_storefront_base/cartridge/scripts/middleware/pageMetaData', {});

describe('pageMetaDataMiddleware', function () {
    var next = sinon.spy();
    var req = {
        pageMetaData: {
            title: 'someTitle',
            description: 'someDescription',
            keywords: 'someKwords',
            pageMetaTags: [
                {
                    title: true,
                    content: 'TestTitle'
                },
                {
                    name: true,
                    ID: 'description',
                    content: 'TestDescription'
                },
                {
                    name: true,
                    ID: 'keywords',
                    content: 'TestKeywords'
                },
                {
                    name: true,
                    ID: 'someName',
                    content: 'someName'
                },
                {
                    property: true,
                    ID: 'someProperty',
                    content: 'someProperty'
                }
            ]
        }
    };
    var res = {
        setViewData: sinon.spy()
    };

    afterEach(function () {
        next.reset();
        res.setViewData.reset();
    });

    it('Should set computed pageMetaData to the view and call next after pageMetaData has been recomputed', function () {
        pageMetaDataMiddleware.computedPageMetaData(req, res, next);
        assert.isTrue(res.setViewData.calledOnce);
        assert.isTrue(next.calledOnce);
    });
});
